// Le scanner en ligne — l'aimant à leads n°1. On récupère la page côté
// serveur (pas de CORS) puis on l'analyse avec le moteur d'audit.
import { NextResponse } from "next/server";
import { auditHtml } from "@/lib/audit";
import fs from "fs";
import path from "path";

const MAX_HTML_BYTES = 2_000_000;
const SCANS_FILE = path.join(process.cwd(), "data", "scans.json");

function normalizeUrl(input: string): URL | null {
  const raw = input.trim();
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
}

// Garde anti-SSRF minimale : uniquement http(s) vers des hôtes publics nommés.
function isForbiddenHost(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  if (!["http:", "https:"].includes(url.protocol)) return true;
  if (!host.includes(".")) return true; // localhost, noms internes
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    const [a, b] = host.split(".").map(Number);
    if (a === 10 || a === 127 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254)) {
      return true;
    }
  }
  if (host === "[::1]" || host.endsWith(".local") || host.endsWith(".internal")) return true;
  return false;
}

function logScan(url: string, score: number) {
  // Journal des scans : chaque URL scannée est un prospect qualifié.
  try {
    let scans: { url: string; score: number; at: string }[] = [];
    try {
      scans = JSON.parse(fs.readFileSync(SCANS_FILE, "utf-8"));
    } catch {
      /* premier scan */
    }
    scans.push({ url, score, at: new Date().toISOString() });
    fs.mkdirSync(path.dirname(SCANS_FILE), { recursive: true });
    fs.writeFileSync(SCANS_FILE, JSON.stringify(scans, null, 2));
  } catch {
    /* le log ne doit jamais faire échouer un scan */
  }
}

export async function POST(request: Request) {
  const { url: input } = (await request.json()) as { url?: string };
  if (!input?.trim()) {
    return NextResponse.json({ error: "Indiquez l'adresse de votre site." }, { status: 400 });
  }

  const url = normalizeUrl(input);
  if (!url || isForbiddenHost(url)) {
    return NextResponse.json({ error: "Adresse invalide. Exemple : www.monsite.fr" }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  let html: string;
  try {
    const res = await fetch(url.href, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AccessiScan/1.0; +https://accessiscan.fr)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Le site a répondu avec une erreur (HTTP ${res.status}). Vérifiez l'adresse.` },
        { status: 422 }
      );
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType && !contentType.includes("html")) {
      return NextResponse.json({ error: "Cette adresse ne renvoie pas une page HTML." }, { status: 422 });
    }
    html = (await res.text()).slice(0, MAX_HTML_BYTES);
  } catch {
    return NextResponse.json(
      { error: "Impossible de joindre ce site (délai dépassé ou site inaccessible)." },
      { status: 422 }
    );
  } finally {
    clearTimeout(timer);
  }

  const result = auditHtml(url.href, html);
  logScan(url.href, result.score);
  return NextResponse.json(result);
}
