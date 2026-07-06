import { redirect } from "next/navigation";
import Link from "next/link";
import { currentCustomer } from "@/lib/auth";
import { listSites, listAudits, PLAN_LIMITS } from "@/lib/store";
import AddSiteForm from "./AddSiteForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tableau de bord — AccessiScan" };

export default async function DashboardPage() {
  const customer = await currentCustomer();
  if (!customer) redirect("/login");

  const sites = listSites(customer.id).map((site) => ({
    site,
    latest: listAudits(site.id)[0],
  }));
  const limits = PLAN_LIMITS[customer.plan];

  return (
    <section className="section">
      {customer.demo && (
        <p className="manual-note" role="status">
          <strong>Mode démonstration</strong> — compte créé sans paiement réel (Stripe non configuré).
          Le parcours et les audits sont réels.
        </p>
      )}
      <div className="dash-head">
        <div>
          <span className="kicker">Espace client — offre {customer.plan === "agence" ? "Agence" : "Pro"}</span>
          <h1>Tableau de bord</h1>
          <p className="lead">
            {sites.length}/{limits.sites} site{limits.sites > 1 ? "s" : ""} suivi{sites.length > 1 ? "s" : ""} ·
            audits jusqu'à {limits.pagesPerAudit} pages · surveillance mensuelle active
          </p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="btn btn-ghost btn-sm">
            Se déconnecter
          </button>
        </form>
      </div>

      {sites.length < limits.sites && <AddSiteForm firstSite={sites.length === 0} />}

      {sites.length > 0 && (
        <div className="site-list">
          {sites.map(({ site, latest }) => (
            <Link key={site.id} href={`/dashboard/site/${site.id}`} className="site-card">
              <div>
                <strong>{site.url.replace(/^https?:\/\//, "")}</strong>
                {latest ? (
                  <p className="result-stats">
                    Dernier audit : {new Date(latest.finishedAt).toLocaleDateString("fr-FR")} ·{" "}
                    {latest.pagesScanned} pages analysées
                  </p>
                ) : (
                  <p className="result-stats">Aucun audit — ouvrez le site pour en lancer un.</p>
                )}
              </div>
              {latest && (
                <span
                  className={`score-chip score-${latest.globalScore >= 80 ? "good" : latest.globalScore >= 50 ? "mid" : "bad"}`}
                >
                  {latest.globalScore}/100
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
