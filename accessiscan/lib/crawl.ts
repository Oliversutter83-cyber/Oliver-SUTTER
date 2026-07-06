// Crawl multi-pages + audit agrégé — le cœur de l'offre payante.
// Découverte des pages via sitemap.xml puis liens internes de l'accueil,
// audit RGAA de chaque page, agrégation en un rapport de site.
import { auditHtml, type AuditResult } from "./audit";
import { config } from "./config";
import { newId, type SiteAudit } from "./store";

const PAGE_TIMEOUT_MS = 8_000;
const CONCURRENCY = 4;
const MAX_HTML_BYTES = 2_000_000;

export function isForbiddenHost(url: URL): boolean {
  if (config.allowLocalScan) return false;
  const host = url.hostname.toLowerCase();
  if (!["http:", "https:"].includes(url.protocol)) return true;
  if (!host.includes(".")) return true;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    const [a, b] = host.split(".").map(Number);
    if (a === 10 || a === 127 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254)) {
      return true;
    }
  }
  if (host === "[::1]" || host.endsWith(".local") || host.endsWith(".internal")) return true;
  return false;
}

async function fetchPage(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PAGE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AccessiScan/1.0; +https://accessiscan.fr)",
        Accept: "text/html,application/xhtml+xml,application/xml",
      },
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    if (type && !type.includes("html") && !type.includes("xml")) return null;
    return (await res.text()).slice(0, MAX_HTML_BYTES);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function extractInternalLinks(html: string, origin: string): string[] {
  const urls = new Set<string>();
  for (const m of html.matchAll(/<a\b[^>]*href\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    const href = (m[2] ?? m[3] ?? "").trim();
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) continue;
    try {
      const url = new URL(href, origin);
      if (url.origin !== origin) continue;
      if (/\.(jpg|jpeg|png|gif|svg|webp|pdf|zip|mp4|mp3|css|js|ico|xml|woff2?)(\?|$)/i.test(url.pathname)) continue;
      url.hash = "";
      urls.add(url.href);
    } catch {
      /* href illisible */
    }
  }
  return [...urls];
}

async function discoverFromSitemap(origin: string, limit: number): Promise<string[]> {
  const xml = await fetchPage(`${origin}/sitemap.xml`);
  if (!xml) return [];
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]);
  // Sitemap index → on descend d'un niveau.
  const pages: string[] = [];
  const childSitemaps = locs.filter((l) => /\.xml(\?|$)/i.test(l)).slice(0, 3);
  const directPages = locs.filter((l) => !/\.xml(\?|$)/i.test(l));
  pages.push(...directPages);
  for (const child of childSitemaps) {
    if (pages.length >= limit) break;
    const childXml = await fetchPage(child);
    if (!childXml) continue;
    pages.push(...[...childXml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]).filter((l) => !/\.xml(\?|$)/i.test(l)));
  }
  return pages.filter((p) => {
    try {
      return new URL(p).origin === origin;
    } catch {
      return false;
    }
  });
}

// Priorise les pages business : accueil, produits, panier, contact, mentions…
function prioritize(urls: string[], origin: string, limit: number): string[] {
  const score = (u: string): number => {
    const p = u.replace(origin, "").toLowerCase();
    if (p === "" || p === "/") return 0;
    if (/(produ|product|boutique|shop|categorie|category|collection)/.test(p)) return 1;
    if (/(panier|cart|checkout|commande|paiement)/.test(p)) return 1;
    if (/(contact|devis|inscription|register|login|compte)/.test(p)) return 2;
    if (/(accessibilite|mentions|cgv|confidentialite)/.test(p)) return 3;
    return 4 + Math.min(p.split("/").length, 5); // pages peu profondes d'abord
  };
  return [...new Set(urls)].sort((a, b) => score(a) - score(b)).slice(0, limit);
}

export interface CrawlProgress {
  discovered: number;
  scanned: number;
}

export async function crawlAndAudit(siteId: string, siteUrl: string, maxPages: number): Promise<SiteAudit> {
  const startedAt = new Date().toISOString();
  const origin = new URL(siteUrl).origin;

  // 1. Découverte des pages
  let candidates = await discoverFromSitemap(origin, maxPages * 4);
  const homeHtml = await fetchPage(origin + "/");
  if (homeHtml) {
    candidates.push(...extractInternalLinks(homeHtml, origin));
  }
  candidates.push(origin + "/");
  const targets = prioritize(candidates, origin, maxPages);

  // 2. Audit de chaque page (pool de concurrence borné)
  const pages: AuditResult[] = [];
  let index = 0;
  async function worker() {
    while (index < targets.length) {
      const url = targets[index++];
      const html = url === origin + "/" && homeHtml ? homeHtml : await fetchPage(url);
      if (html) pages.push(auditHtml(url, html));
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker));

  // 3. Agrégation
  pages.sort((a, b) => a.score - b.score); // pires pages en premier
  const globalScore = pages.length ? Math.round(pages.reduce((sum, p) => sum + p.score, 0) / pages.length) : 0;
  const worstRisk = pages.some((p) => p.risk === "eleve") ? "eleve" : pages.some((p) => p.risk === "moyen") ? "moyen" : "faible";

  return {
    id: newId("aud"),
    siteId,
    startedAt,
    finishedAt: new Date().toISOString(),
    pagesScanned: pages.length,
    globalScore,
    risk: worstRisk,
    pages,
  };
}

// Regroupe les constats de toutes les pages par type — le "plan d'action".
export function aggregateFindings(audit: SiteAudit) {
  const groups = new Map<
    string,
    { id: string; rgaa: string; title: string; severity: string; advice: string; totalCount: number; pages: { url: string; count: number }[] }
  >();
  for (const page of audit.pages) {
    for (const f of page.findings) {
      const g = groups.get(f.id) ?? {
        id: f.id,
        rgaa: f.rgaa,
        title: f.title,
        severity: f.severity,
        advice: f.advice,
        totalCount: 0,
        pages: [],
      };
      g.totalCount += f.count;
      g.pages.push({ url: page.url, count: f.count });
      groups.set(f.id, g);
    }
  }
  return [...groups.values()].sort((a, b) =>
    a.severity === b.severity ? b.totalCount - a.totalCount : a.severity === "critical" ? -1 : 1
  );
}
