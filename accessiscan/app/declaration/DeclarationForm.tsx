"use client";

// Générateur de déclaration : formulaire → texte légal prêt à publier.
// Tout se passe côté client (lib partagée), l'email est demandé avant la copie —
// c'est notre meilleur aimant à leads qualifiés.
import { useState } from "react";
import { generateDeclaration, type DeclarationInput } from "@/lib/declaration";

export default function DeclarationForm() {
  const [form, setForm] = useState({
    orgName: "",
    siteName: "",
    siteUrl: "",
    status: "non-conforme" as DeclarationInput["status"],
    auditMethod: "automatise" as DeclarationInput["auditMethod"],
    contactEmail: "",
    technologies: "HTML, CSS, JavaScript",
  });
  const [output, setOutput] = useState<string | null>(null);
  const [leadEmail, setLeadEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm({ ...form, [key]: value });
  }

  function generate(e: React.FormEvent) {
    e.preventDefault();
    const text = generateDeclaration({
      orgName: form.orgName,
      siteName: form.siteName || undefined,
      siteUrl: form.siteUrl,
      status: form.status,
      auditDate: new Date().toISOString().slice(0, 10),
      auditMethod: form.auditMethod,
      contactEmail: form.contactEmail,
      technologies: form.technologies || undefined,
    });
    setOutput(text);
    setCopied(false);
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, source: "declaration" }),
      });
    } catch {
      /* la capture ne doit pas bloquer l'outil */
    }
    setUnlocked(true);
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
  }

  return (
    <>
      <form className="form-grid" onSubmit={generate} style={{ maxWidth: 720 }}>
        <div className="two-col">
          <label>
            Raison sociale
            <input
              type="text"
              required
              placeholder="SARL Dupont & Fils"
              value={form.orgName}
              onChange={(e) => set("orgName", e.target.value)}
            />
          </label>
          <label>
            Nom du site <span className="form-hint">(facultatif)</span>
            <input
              type="text"
              placeholder="Boutique Dupont"
              value={form.siteName}
              onChange={(e) => set("siteName", e.target.value)}
            />
          </label>
        </div>
        <div className="two-col">
          <label>
            Adresse du site
            <input
              type="text"
              inputMode="url"
              required
              placeholder="https://www.monsite.fr"
              value={form.siteUrl}
              onChange={(e) => set("siteUrl", e.target.value)}
            />
          </label>
          <label>
            Email de contact accessibilité
            <input
              type="email"
              required
              placeholder="contact@monsite.fr"
              value={form.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
            />
          </label>
        </div>
        <div className="two-col">
          <label>
            État de conformité
            <select value={form.status} onChange={(e) => set("status", e.target.value as DeclarationInput["status"])}>
              <option value="non-conforme">Non conforme (pas encore d'audit complet)</option>
              <option value="partiellement-conforme">Partiellement conforme (audit réalisé, ≥ 50 %)</option>
              <option value="totalement-conforme">Totalement conforme (audit réalisé, 100 %)</option>
            </select>
          </label>
          <label>
            Type d'analyse réalisée
            <select
              value={form.auditMethod}
              onChange={(e) => set("auditMethod", e.target.value as DeclarationInput["auditMethod"])}
            >
              <option value="automatise">Scan automatisé (AccessiScan gratuit)</option>
              <option value="manuel">Audit manuel RGAA complet</option>
            </select>
          </label>
        </div>
        <label>
          Technologies du site <span className="form-hint">(facultatif)</span>
          <input
            type="text"
            value={form.technologies}
            onChange={(e) => set("technologies", e.target.value)}
          />
        </label>
        <div>
          <button type="submit" className="btn btn-primary btn-lg">
            Générer ma déclaration
          </button>
        </div>
      </form>

      {output && (
        <div className="declaration-output" aria-live="polite">
          {!unlocked ? (
            <>
              <h3>Votre déclaration est prête ✓</h3>
              <p>
                Indiquez votre email professionnel pour l'afficher et la copier. Vous recevrez aussi le guide
                de publication (où la mettre, quoi corriger en premier) — pas de spam, désinscription en un
                clic.
              </p>
              <form className="lead-form" onSubmit={unlock} style={{ justifyContent: "flex-start" }}>
                <label htmlFor="lead-declaration" style={{ position: "absolute", left: "-9999px" }}>
                  Votre adresse email professionnelle
                </label>
                <input
                  id="lead-declaration"
                  type="email"
                  required
                  placeholder="votre@email.fr"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Afficher ma déclaration
                </button>
              </form>
            </>
          ) : (
            <>
              <h3>Votre déclaration d'accessibilité</h3>
              <p>
                Publiez-la sur une page dédiée (ex. <code>monsite.fr/accessibilite</code>) et ajoutez le lien
                « Accessibilité » dans le pied de page de toutes vos pages.
              </p>
              <textarea readOnly value={output} aria-label="Texte de la déclaration d'accessibilité" />
              <p style={{ marginTop: "1rem" }}>
                <button type="button" className="btn btn-primary" onClick={copy}>
                  {copied ? "Copié ✓" : "Copier le texte"}
                </button>
              </p>
              <p className="scan-note">
                Rappel : une déclaration « non conforme » publiée vaut mieux que pas de déclaration, mais
                l'objectif légal reste la mise en conformité. L'offre Pro fournit l'audit complet et le plan
                d'action.
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
