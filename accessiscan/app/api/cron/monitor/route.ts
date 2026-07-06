// Surveillance mensuelle : re-audit de tous les sites actifs, alerte email
// en cas de régression, rapport horodaté sinon. Appelé par un cron
// (vercel.json fourni ; sinon un simple `curl` en crontab avec le secret).
import { NextResponse } from "next/server";
import { listCustomers, listSites, listAudits, saveAudit, PLAN_LIMITS } from "@/lib/store";
import { crawlAndAudit } from "@/lib/crawl";
import { sendEmail, regressionEmail, monitoringOkEmail } from "@/lib/email";
import { config } from "@/lib/config";

export const maxDuration = 300;

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = new URL(request.url).searchParams.get("secret");
  if (!config.cronSecret || (auth !== `Bearer ${config.cronSecret}` && secret !== config.cronSecret)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const customers = new Map(listCustomers().filter((c) => c.status === "active").map((c) => [c.id, c]));
  const results: { site: string; score: number; previous?: number; alerted: boolean }[] = [];

  for (const site of listSites()) {
    const customer = customers.get(site.customerId);
    if (!customer) continue;

    const previous = listAudits(site.id)[0];
    const audit = await crawlAndAudit(site.id, site.url, PLAN_LIMITS[customer.plan].pagesPerAudit);
    if (audit.pagesScanned === 0) continue;
    saveAudit(audit);

    let alerted = false;
    const dashboardUrl = `${config.appUrl}/dashboard/site/${site.id}`;
    if (previous && audit.globalScore < previous.globalScore - 3) {
      await sendEmail(
        customer.email,
        `⚠ Régression d'accessibilité sur ${site.url}`,
        regressionEmail(site.url, previous.globalScore, audit.globalScore, dashboardUrl)
      );
      alerted = true;
    } else {
      await sendEmail(
        customer.email,
        `Votre rapport mensuel d'accessibilité — ${site.url}`,
        monitoringOkEmail(site.url, audit.globalScore, `${config.appUrl}/rapport/${audit.id}`)
      );
    }
    results.push({ site: site.url, score: audit.globalScore, previous: previous?.globalScore, alerted });
  }

  return NextResponse.json({ monitored: results.length, results });
}
