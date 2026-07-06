// Moteur d'audit d'accessibilité — analyse statique du HTML contre les
// critères RGAA testables automatiquement. C'est l'actif technique partagé
// entre le scanner du site (API) et, en logique équivalente, le plugin WordPress.
//
// Honnêteté produit : un audit automatique couvre ~30 % des critères RGAA.
// Le résultat est donc un "niveau de risque", jamais un certificat de conformité —
// c'est précisément ce qui différencie AccessiScan des widgets "overlay".

export type Severity = "critical" | "warning";

export interface Finding {
  id: string;
  rgaa: string; // critère(s) RGAA 4.1.2 concerné(s)
  title: string;
  severity: Severity;
  count: number;
  excerpts: string[]; // extraits HTML fautifs (tronqués), max 3
  advice: string;
}

export interface AuditResult {
  url: string;
  scannedAt: string;
  score: number; // 0-100 — part automatisable uniquement
  risk: "eleve" | "moyen" | "faible";
  findings: Finding[];
  manualChecks: string[]; // ce que seul un audit manuel peut vérifier
  stats: { images: number; links: number; fields: number; iframes: number; headings: number };
}

/* ---------- Petits utilitaires de parsing (zéro dépendance) ---------- */

function stripNoise(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, "<svg-placeholder>");
}

function getAttr(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  if (!m) return undefined;
  return (m[2] ?? m[3] ?? m[4] ?? "").trim();
}

function hasAttr(tag: string, name: string): boolean {
  return new RegExp(`\\b${name}(\\s|=|>|$)`, "i").test(tag);
}

function textContent(inner: string): string {
  return inner
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(tag: string): string {
  const clean = tag.replace(/\s+/g, " ").trim();
  return clean.length > 140 ? clean.slice(0, 137) + "…" : clean;
}

/* ---------- Les contrôles ---------- */

interface Check {
  id: string;
  rgaa: string;
  title: string;
  severity: Severity;
  weight: number; // points retirés au maximum pour ce contrôle
  advice: string;
  run: (html: string) => string[]; // extraits fautifs (1 par occurrence)
}

const CHECKS: Check[] = [
  {
    id: "img-alt",
    rgaa: "RGAA 1.1",
    title: "Images sans alternative textuelle (attribut alt)",
    severity: "critical",
    weight: 15,
    advice:
      "Chaque <img> doit porter un attribut alt : descriptif si l'image est porteuse d'information, vide (alt=\"\") si elle est décorative.",
    run: (html) =>
      (html.match(/<img\b[^>]*>/gi) ?? [])
        .filter((tag) => getAttr(tag, "alt") === undefined && getAttr(tag, "role") !== "presentation" && !hasAttr(tag, "aria-hidden"))
        .map(excerpt),
  },
  {
    id: "empty-links",
    rgaa: "RGAA 6.1, 6.2",
    title: "Liens sans intitulé (vides pour un lecteur d'écran)",
    severity: "critical",
    weight: 15,
    advice:
      "Un lien doit avoir un nom accessible : texte visible, aria-label, ou une image avec alt descriptif. Un lien vide est inutilisable au lecteur d'écran.",
    run: (html) =>
      (html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? [])
        .filter((link) => {
          const open = link.match(/<a\b[^>]*>/i)![0];
          if (getAttr(open, "aria-label") || getAttr(open, "aria-labelledby") || getAttr(open, "title")) return false;
          if (getAttr(open, "href") === undefined) return false; // ancre technique
          const inner = link.replace(/^<a\b[^>]*>/i, "").replace(/<\/a>$/i, "");
          if (textContent(inner)) return false;
          const img = inner.match(/<img\b[^>]*>/i);
          if (img && (getAttr(img[0], "alt") ?? "").length > 0) return false;
          if (/aria-label/i.test(inner)) return false;
          return true;
        })
        .map(excerpt),
  },
  {
    id: "form-labels",
    rgaa: "RGAA 11.1",
    title: "Champs de formulaire sans étiquette",
    severity: "critical",
    weight: 15,
    advice:
      "Chaque champ (<input>, <select>, <textarea>) doit être relié à un <label for=\"…\">, ou porter aria-label / aria-labelledby / title.",
    run: (html) => {
      const labelFor = new Set(
        (html.match(/<label\b[^>]*>/gi) ?? [])
          .map((tag) => getAttr(tag, "for"))
          .filter((v): v is string => !!v)
      );
      const fields = [
        ...(html.match(/<input\b[^>]*>/gi) ?? []),
        ...(html.match(/<select\b[^>]*>/gi) ?? []),
        ...(html.match(/<textarea\b[^>]*>/gi) ?? []),
      ];
      return fields
        .filter((tag) => {
          const type = (getAttr(tag, "type") ?? "text").toLowerCase();
          if (["hidden", "submit", "button", "image", "reset"].includes(type)) return false;
          if (getAttr(tag, "aria-label") || getAttr(tag, "aria-labelledby") || getAttr(tag, "title")) return false;
          const id = getAttr(tag, "id");
          if (id && labelFor.has(id)) return false;
          return true;
        })
        .map(excerpt);
    },
  },
  {
    id: "html-lang",
    rgaa: "RGAA 8.3, 8.4",
    title: "Langue de la page absente ou invalide",
    severity: "critical",
    weight: 10,
    advice:
      "La balise <html> doit porter lang=\"fr\" (ou la langue réelle du contenu). Sans elle, les lecteurs d'écran prononcent le texte avec une mauvaise voix.",
    run: (html) => {
      const tag = html.match(/<html\b[^>]*>/i)?.[0];
      if (!tag) return [];
      const lang = getAttr(tag, "lang");
      return lang && /^[a-z]{2,3}(-[a-z0-9]+)*$/i.test(lang) ? [] : [excerpt(tag)];
    },
  },
  {
    id: "page-title",
    rgaa: "RGAA 8.5, 8.6",
    title: "Titre de page (<title>) absent ou vide",
    severity: "critical",
    weight: 8,
    advice:
      "Chaque page doit avoir un <title> unique et descriptif — c'est la première information annoncée par un lecteur d'écran.",
    run: (html) => {
      const m = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
      return m && textContent(m[1]) ? [] : ["<title> manquant ou vide"];
    },
  },
  {
    id: "iframe-title",
    rgaa: "RGAA 2.1",
    title: "Cadres (iframe) sans titre",
    severity: "critical",
    weight: 8,
    advice: "Chaque <iframe> doit porter un attribut title décrivant son contenu (ex. title=\"Carte d'accès\").",
    run: (html) =>
      (html.match(/<iframe\b[^>]*>/gi) ?? [])
        .filter((tag) => !(getAttr(tag, "title") ?? "").length && !hasAttr(tag, "aria-hidden"))
        .map(excerpt),
  },
  {
    id: "empty-buttons",
    rgaa: "RGAA 11.9",
    title: "Boutons sans nom accessible",
    severity: "critical",
    weight: 10,
    advice:
      "Un <button> doit avoir un texte visible ou un aria-label. Un bouton-icône muet est invisible pour un lecteur d'écran.",
    run: (html) =>
      (html.match(/<button\b[^>]*>[\s\S]*?<\/button>/gi) ?? [])
        .filter((btn) => {
          const open = btn.match(/<button\b[^>]*>/i)![0];
          if (getAttr(open, "aria-label") || getAttr(open, "aria-labelledby") || getAttr(open, "title")) return false;
          const inner = btn.replace(/^<button\b[^>]*>/i, "").replace(/<\/button>$/i, "");
          if (textContent(inner)) return false;
          const img = inner.match(/<img\b[^>]*>/i);
          if (img && (getAttr(img[0], "alt") ?? "").length > 0) return false;
          return true;
        })
        .map(excerpt),
  },
  {
    id: "heading-structure",
    rgaa: "RGAA 9.1",
    title: "Hiérarchie de titres incohérente",
    severity: "warning",
    weight: 8,
    advice:
      "La page doit avoir un <h1>, et les niveaux ne doivent pas sauter (h2 → h4). Les titres sont le plan de navigation des lecteurs d'écran.",
    run: (html) => {
      const levels = (html.match(/<h([1-6])\b/gi) ?? []).map((h) => parseInt(h.slice(2), 10));
      const issues: string[] = [];
      if (!levels.includes(1)) issues.push("Aucun <h1> sur la page");
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i - 1] > 1) {
          issues.push(`Saut de niveau : h${levels[i - 1]} suivi de h${levels[i]}`);
          break;
        }
      }
      return issues;
    },
  },
  {
    id: "duplicate-ids",
    rgaa: "RGAA 8.2",
    title: "Identifiants (id) dupliqués",
    severity: "warning",
    weight: 5,
    advice:
      "Des id dupliqués cassent les associations label/champ et les ancres pour les technologies d'assistance.",
    run: (html) => {
      const seen = new Map<string, number>();
      for (const m of html.matchAll(/\sid\s*=\s*("([^"]+)"|'([^']+)')/gi)) {
        const id = (m[2] ?? m[3]).trim();
        if (id) seen.set(id, (seen.get(id) ?? 0) + 1);
      }
      return [...seen.entries()].filter(([, n]) => n > 1).map(([id, n]) => `id="${id}" présent ${n} fois`);
    },
  },
  {
    id: "positive-tabindex",
    rgaa: "RGAA 12.8",
    title: "tabindex positif (ordre de tabulation forcé)",
    severity: "warning",
    weight: 5,
    advice:
      "tabindex > 0 casse l'ordre naturel de navigation au clavier. Utilisez uniquement tabindex=\"0\" ou \"-1\".",
    run: (html) =>
      (html.match(/<[a-z][^>]*\btabindex\s*=\s*("?\d+"?)[^>]*>/gi) ?? [])
        .filter((tag) => parseInt(getAttr(tag, "tabindex") ?? "0", 10) > 0)
        .map(excerpt),
  },
  {
    id: "zoom-blocked",
    rgaa: "RGAA 10.4",
    title: "Zoom bloqué sur mobile",
    severity: "warning",
    weight: 6,
    advice:
      "Le meta viewport ne doit pas contenir user-scalable=no ni maximum-scale < 2 : les personnes malvoyantes doivent pouvoir zoomer à 200 %.",
    run: (html) => {
      const meta = (html.match(/<meta\b[^>]*name\s*=\s*["']viewport["'][^>]*>/gi) ?? [])[0];
      if (!meta) return [];
      const content = (getAttr(meta, "content") ?? "").toLowerCase();
      const maxScale = content.match(/maximum-scale\s*=\s*([\d.]+)/)?.[1];
      if (/user-scalable\s*=\s*(no|0)/.test(content) || (maxScale && parseFloat(maxScale) < 2)) {
        return [excerpt(meta)];
      }
      return [];
    },
  },
  {
    id: "autoplay",
    rgaa: "RGAA 4.10",
    title: "Média en lecture automatique",
    severity: "warning",
    weight: 5,
    advice:
      "Un son ou une vidéo lancé automatiquement doit pouvoir être stoppé. Évitez autoplay, surtout avec du son.",
    run: (html) =>
      (html.match(/<(video|audio)\b[^>]*\bautoplay\b[^>]*>/gi) ?? []).map(excerpt),
  },
];

const MANUAL_CHECKS = [
  "Contrastes de couleurs texte/fond (RGAA 3.2) — nécessite le rendu CSS",
  "Sous-titres et transcriptions des vidéos (RGAA 4.1 à 4.5)",
  "Navigation complète au clavier, sans piège de focus (RGAA 12.13)",
  "Visibilité de l'indicateur de focus (RGAA 10.7)",
  "Compréhensibilité des messages d'erreur de formulaire (RGAA 11.10, 11.11)",
  "Pertinence des alternatives textuelles rédigées (un alt présent peut être mal rédigé)",
];

/* ---------- Audit ---------- */

export function auditHtml(url: string, rawHtml: string): AuditResult {
  const html = stripNoise(rawHtml);

  const findings: Finding[] = [];
  let score = 100;

  for (const check of CHECKS) {
    const hits = check.run(html);
    if (hits.length === 0) continue;
    // Pénalité progressive : la 1re occurrence coûte le plus, plafonnée au poids du contrôle.
    const penalty = Math.min(check.weight, Math.round(check.weight * (0.5 + 0.125 * (hits.length - 1))));
    score -= penalty;
    findings.push({
      id: check.id,
      rgaa: check.rgaa,
      title: check.title,
      severity: check.severity,
      count: hits.length,
      excerpts: hits.slice(0, 3),
      advice: check.advice,
    });
  }

  score = Math.max(0, Math.min(100, score));
  findings.sort((a, b) => (a.severity === b.severity ? b.count - a.count : a.severity === "critical" ? -1 : 1));

  const hasCritical = findings.some((f) => f.severity === "critical");
  const risk: AuditResult["risk"] = hasCritical || score < 50 ? "eleve" : score < 80 ? "moyen" : "faible";

  return {
    url,
    scannedAt: new Date().toISOString(),
    score,
    risk,
    findings,
    manualChecks: MANUAL_CHECKS,
    stats: {
      images: (html.match(/<img\b/gi) ?? []).length,
      links: (html.match(/<a\b/gi) ?? []).length,
      fields: (html.match(/<(input|select|textarea)\b/gi) ?? []).length,
      iframes: (html.match(/<iframe\b/gi) ?? []).length,
      headings: (html.match(/<h[1-6]\b/gi) ?? []).length,
    },
  };
}
