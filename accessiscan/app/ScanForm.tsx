"use client";

// Le scanner interactif : URL → score + constats en 30 secondes.
// Chaque scan se termine par le CTA Pro : c'est le tunnel de vente entier.
import { useState } from "react";
import Link from "next/link";
import type { AuditResult } from "@/lib/audit";

const RISK_LABEL: Record<AuditResult["risk"], string> = {
  eleve: "Risque juridique élevé",
  moyen: "Risque juridique moyen",
  faible: "Risque résiduel — audit manuel recommandé",
};

export default function ScanForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  async function scan(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue. Réessayez.");
      } else {
        setResult(data as AuditResult);
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const ringColor =
    result && result.score >= 80 ? "var(--accent)" : result && result.score >= 50 ? "var(--warn)" : "var(--danger)";

  return (
    <div className="scanner-card" id="scanner">
      <form className="scan-form" onSubmit={scan}>
        <label htmlFor="scan-url">Adresse de votre site</label>
        <input
          id="scan-url"
          type="text"
          inputMode="url"
          placeholder="www.monsite.fr"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          autoComplete="url"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Analyse en cours…" : "Analyser gratuitement"}
        </button>
      </form>
      {error && (
        <p className="scan-error" role="alert">
          {error}
        </p>
      )}
      <p className="scan-note">
        Analyse de la page d'accueil contre les critères RGAA testables automatiquement. Gratuit, sans
        inscription, aucune installation.
      </p>

      {result && (
        <div className="result" aria-live="polite">
          <div className="result-head">
            <div
              className="score-ring"
              style={{ ["--pct" as string]: result.score, ["--ring" as string]: ringColor }}
              role="img"
              aria-label={`Score d'accessibilité automatisé : ${result.score} sur 100`}
            >
              <span>{result.score}</span>
            </div>
            <div>
              <span className={`risk-pill risk-${result.risk}`}>{RISK_LABEL[result.risk]}</span>
              <p className="result-stats">
                {result.findings.length === 0
                  ? "Aucune non-conformité détectable automatiquement — bravo. Restent les critères manuels ci-dessous."
                  : `${result.findings.length} type${result.findings.length > 1 ? "s" : ""} de non-conformité détecté${result.findings.length > 1 ? "s" : ""} sur la page d'accueil`}
                <br />
                {result.stats.images} images · {result.stats.links} liens · {result.stats.fields} champs de
                formulaire analysés
              </p>
            </div>
          </div>

          {result.findings.length > 0 && (
            <ul className="findings">
              {result.findings.map((f) => (
                <li key={f.id}>
                  <details className="finding">
                    <summary>
                      <span className={`sev sev-${f.severity}`} aria-hidden="true" />
                      {f.title}
                      <span className="finding-count">
                        {f.count} occurrence{f.count > 1 ? "s" : ""}
                      </span>
                    </summary>
                    <div className="finding-body">
                      <span className="rgaa-ref">{f.rgaa}</span>
                      <p>{f.advice}</p>
                      {f.excerpts.length > 0 && <pre>{f.excerpts.join("\n")}</pre>}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          )}

          <div className="manual-note">
            <strong>Important :</strong> un scan automatique couvre environ un tiers des critères RGAA.
            Contrastes, sous-titres, navigation clavier… exigent une vérification humaine — c'est ce que
            couvre l'offre Pro.
          </div>

          <div className="result-cta">
            <h3>Mettez-vous en conformité avant le contrôle</h3>
            <p>
              Rapport complet page par page, plan d'action priorisé, déclaration d'accessibilité légale et
              surveillance mensuelle — à partir de 29 €/mois, sans engagement.
            </p>
            <Link href="/#tarifs" className="btn btn-primary">
              Voir les offres
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
