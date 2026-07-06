// Rapport d'audit horodaté — la pièce que le client présente en cas de contrôle.
// Optimisé pour l'impression : « Enregistrer en PDF » depuis le navigateur.
// Accès par lien non devinable (IDs aléatoires), partageable avec un développeur/une agence.
import { notFound } from "next/navigation";
import { getAudit, getSite } from "@/lib/store";
import { aggregateFindings } from "@/lib/crawl";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Rapport d'audit d'accessibilité — AccessiScan" };

const RISK_LABEL = {
  eleve: "Risque juridique élevé",
  moyen: "Risque juridique moyen",
  faible: "Risque résiduel — audit manuel recommandé",
} as const;

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = getAudit(id);
  if (!audit) notFound();
  const site = getSite(audit.siteId);
  if (!site) notFound();

  const groups = aggregateFindings(audit);
  const criticals = groups.filter((g) => g.severity === "critical");
  const warnings = groups.filter((g) => g.severity !== "critical");
  const generatedAt = new Date(audit.finishedAt);

  return (
    <div className="report">
      <div className="report-toolbar no-print">
        <PrintButton />
      </div>

      <header className="report-head">
        <p className="report-brand">
          Accessi<em>Scan</em>
        </p>
        <h1>Rapport d'audit d'accessibilité automatisé</h1>
        <table className="report-meta">
          <tbody>
            <tr>
              <th scope="row">Site audité</th>
              <td>{site.url}</td>
            </tr>
            <tr>
              <th scope="row">Date de l'audit</th>
              <td>
                {generatedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} à{" "}
                {generatedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </td>
            </tr>
            <tr>
              <th scope="row">Référence du rapport</th>
              <td>{audit.id}</td>
            </tr>
            <tr>
              <th scope="row">Périmètre</th>
              <td>{audit.pagesScanned} pages · critères RGAA 4.1.2 testables automatiquement</td>
            </tr>
            <tr>
              <th scope="row">Résultat</th>
              <td>
                <strong>{audit.globalScore}/100</strong> — {RISK_LABEL[audit.risk]}
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <section>
        <h2>1. Synthèse</h2>
        <p>
          L'analyse automatisée de {audit.pagesScanned} pages du site {site.url} a relevé{" "}
          <strong>{criticals.length} type(s) de non-conformité critique</strong> et {warnings.length} point(s)
          d'avertissement au regard des critères du RGAA (Référentiel général d'amélioration de
          l'accessibilité, version 4.1.2) testables automatiquement.
        </p>
        <p>
          Ce rapport horodaté documente la démarche de mise en conformité engagée au titre de la directive
          (UE) 2019/882 (European Accessibility Act) et de l'article 47 de la loi n° 2005-102. Il ne
          constitue pas un audit de conformité complet au sens du RGAA : environ un tiers des critères est
          testable automatiquement, le reste exigeant une vérification humaine (contrastes calculés,
          pertinence des alternatives, navigation clavier, médias).
        </p>
      </section>

      <section>
        <h2>2. Plan d'action priorisé</h2>
        {groups.length === 0 ? (
          <p>Aucune non-conformité détectable automatiquement n'a été relevée sur le périmètre audité.</p>
        ) : (
          groups.map((g, i) => (
            <div key={g.id} className="report-finding">
              <h3>
                {i + 1}. {g.title}{" "}
                <span className={`report-sev report-sev-${g.severity}`}>
                  {g.severity === "critical" ? "Critique" : "Avertissement"}
                </span>
              </h3>
              <p className="report-ref">
                {g.rgaa} · {g.totalCount} occurrence(s) sur {g.pages.length} page(s)
              </p>
              <p>{g.advice}</p>
              <p className="report-pages">
                Pages concernées : {g.pages.map((p) => new URL(p.url).pathname).join(" · ")}
              </p>
            </div>
          ))
        )}
      </section>

      <section>
        <h2>3. Résultats par page</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th scope="col">Page</th>
              <th scope="col">Score</th>
              <th scope="col">Constats critiques</th>
              <th scope="col">Avertissements</th>
            </tr>
          </thead>
          <tbody>
            {audit.pages.map((p) => (
              <tr key={p.url}>
                <td>{new URL(p.url).pathname}</td>
                <td>{p.score}/100</td>
                <td>{p.findings.filter((f) => f.severity === "critical").reduce((s, f) => s + f.count, 0)}</td>
                <td>{p.findings.filter((f) => f.severity !== "critical").reduce((s, f) => s + f.count, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>4. Vérifications manuelles restantes</h2>
        <p>Les points suivants ne sont pas testables automatiquement et doivent faire l'objet d'une vérification humaine :</p>
        <ul>
          {(audit.pages[0]?.manualChecks ?? []).map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <footer className="report-foot">
        <p>
          Rapport généré par AccessiScan le{" "}
          {generatedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} —
          référence {audit.id}. La surveillance mensuelle archive un rapport par mois : la série constitue la
          preuve d'une démarche d'amélioration continue.
        </p>
      </footer>
    </div>
  );
}
