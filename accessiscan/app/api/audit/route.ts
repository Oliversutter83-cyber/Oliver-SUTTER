// (Re)lance l'audit complet d'un site du client.
import { NextResponse } from "next/server";
import { currentCustomer } from "@/lib/auth";
import { getSite, saveAudit, PLAN_LIMITS } from "@/lib/store";
import { crawlAndAudit } from "@/lib/crawl";

export const maxDuration = 60;

export async function POST(request: Request) {
  const customer = await currentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Session expirée — reconnectez-vous." }, { status: 401 });
  }

  const { siteId } = (await request.json()) as { siteId?: string };
  const site = siteId ? getSite(siteId) : undefined;
  if (!site || site.customerId !== customer.id) {
    return NextResponse.json({ error: "Site introuvable." }, { status: 404 });
  }

  const audit = await crawlAndAudit(site.id, site.url, PLAN_LIMITS[customer.plan].pagesPerAudit);
  if (audit.pagesScanned === 0) {
    return NextResponse.json({ error: "Aucune page n'a pu être analysée — le site est-il accessible ?" }, { status: 422 });
  }
  saveAudit(audit);
  return NextResponse.json({ auditId: audit.id, score: audit.globalScore, pages: audit.pagesScanned });
}
