import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { currentCustomer } from "@/lib/auth";
import { getSite, listAudits } from "@/lib/store";
import { aggregateFindings } from "@/lib/crawl";
import ReauditButton from "./ReauditButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Audit du site — AccessiScan" };

const RISK_LABEL = {
  eleve: "Risque juridique élevé",
  moyen: "Risque juridique moyen",
  faible: "Risque résiduel — audit manuel recommandé",
} as const;

export default async function SitePage({ params }: { params: Promise<{ id: string }> }) {
  const customer = await currentCustomer();
  if (!customer) redirect("/login");

  const { id } = await params;
  const site = getSite(id);
  if (!site || site.customerId !== customer.id) notFound();

  const audits = listAudits(site.id);
  const latest = audits[0];
  const groups = latest ? aggregateFindings(latest) : [];

  return (
    <section className="section">
      <p>
        <Link href="/dashboard">← Tableau de bord</Link>
      </p>
      <div className="dash-head">
        <div>
          <h1 style={{ wordBreak: "break-all" }}>{site.url.replace(/^https?:\/\//, "")}</h1>
          {latest && (
            <p className="lead">
              Audit du {new Date(latest.finishedAt).toLocaleDateString("fr-FR")} · {latest.pagesScanned} pages ·{" "}
              <span className={`risk-pill risk-${latest.risk}`}>{RISK_LABEL[latest.risk]}</span>
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          {latest && (
            <Link href={`/rapport/${latest.id}`} className="btn btn-ghost btn-sm">
              Rapport PDF horodaté
            </Link>
          )}
          <ReauditButton siteId={site.id} />
        </div>
      </div>

      {!latest ? (
        <p className="manual-note">Aucun audit pour l'instant — lancez-en un avec le bouton ci-dessus.</p>
      ) : (
        <>
          <div className="stats-band" style={{ marginTop: "1.5rem" }}>
            <div className="stat">
              <strong>{latest.globalScore}/100</strong>
              <span>score global (moyenne des pages)</span>
            </div>
            <div className="stat">
              <strong>{groups.filter((g) => g.severity === "critical").length}</strong>
              <span>types de non-conformités critiques</span>
            </div>
            <div className="stat">
              <strong>{latest.pages.filter((p) => p.score < 50).length}</strong>
              <span>pages en risque élevé</span>
            </div>
            <div className="stat">
              <strong>{audits.length}</strong>
              <span>audits archivés (preuve de démarche)</span>
            </div>
          </div>

          <h2 style={{ marginTop: "2.5rem" }}>Plan d'action priorisé</h2>
          <p className="lead">
            Corrigez dans l'ordre : chaque bloc indique les pages touchées et la correction à transmettre à
            votre développeur.
          </p>
          {groups.length === 0 ? (
            <p className="manual-note">
              Aucune non-conformité détectable automatiquement — il reste les vérifications manuelles
              (contrastes, clavier, médias), listées dans le rapport.
            </p>
          ) : (
            <ul className="findings">
              {groups.map((g) => (
                <li key={g.id}>
                  <details className="finding">
                    <summary>
                      <span className={`sev sev-${g.severity}`} aria-hidden="true" />
                      {g.title}
                      <span className="finding-count">
                        {g.totalCount} occ. · {g.pages.length} page{g.pages.length > 1 ? "s" : ""}
                      </span>
                    </summary>
                    <div className="finding-body">
                      <span className="rgaa-ref">{g.rgaa}</span>
                      <p>{g.advice}</p>
                      <p style={{ fontSize: "0.9rem", color: "var(--ink-faint)" }}>
                        Pages concernées :{" "}
                        {g.pages
                          .slice(0, 8)
                          .map((p) => new URL(p.url).pathname)
                          .join(" · ")}
                        {g.pages.length > 8 ? ` · +${g.pages.length - 8} autres` : ""}
                      </p>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          )}

          <h2 style={{ marginTop: "2.5rem" }}>Détail par page</h2>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Page</th>
                  <th scope="col">Score</th>
                  <th scope="col">Constats</th>
                </tr>
              </thead>
              <tbody>
                {latest.pages.map((p) => (
                  <tr key={p.url}>
                    <td style={{ wordBreak: "break-all" }}>{new URL(p.url).pathname}</td>
                    <td>
                      <span className={`score-chip score-${p.score >= 80 ? "good" : p.score >= 50 ? "mid" : "bad"}`}>
                        {p.score}
                      </span>
                    </td>
                    <td>
                      {p.findings.length === 0
                        ? "—"
                        : p.findings.map((f) => `${f.title.split(" (")[0]} ×${f.count}`).join(" · ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {audits.length > 1 && (
            <>
              <h2 style={{ marginTop: "2.5rem" }}>Historique</h2>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Score</th>
                      <th scope="col">Pages</th>
                      <th scope="col">Rapport</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audits.map((a) => (
                      <tr key={a.id}>
                        <td>{new Date(a.finishedAt).toLocaleDateString("fr-FR")}</td>
                        <td>{a.globalScore}/100</td>
                        <td>{a.pagesScanned}</td>
                        <td>
                          <Link href={`/rapport/${a.id}`}>Ouvrir</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
