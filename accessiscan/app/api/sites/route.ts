// Ajout d'un site à suivre (dans la limite du plan) puis premier audit immédiat.
import { NextResponse } from "next/server";
import { currentCustomer } from "@/lib/auth";
import { addSite, saveAudit, PLAN_LIMITS } from "@/lib/store";
import { crawlAndAudit, isForbiddenHost } from "@/lib/crawl";

export const maxDuration = 60;

export async function POST(request: Request) {
  const customer = await currentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Session expirée — reconnectez-vous." }, { status: 401 });
  }

  const { url } = (await request.json()) as { url?: string };
  if (!url?.trim()) {
    return NextResponse.json({ error: "Indiquez l'adresse du site." }, { status: 400 });
  }
  try {
    const parsed = new URL(/^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`);
    if (isForbiddenHost(parsed)) {
      return NextResponse.json({ error: "Adresse invalide." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Adresse invalide." }, { status: 400 });
  }

  const site = addSite(customer, url);
  if ("error" in site) {
    return NextResponse.json({ error: site.error }, { status: 400 });
  }

  // Premier audit lancé immédiatement : le client voit la valeur en 1 minute.
  const audit = await crawlAndAudit(site.id, site.url, PLAN_LIMITS[customer.plan].pagesPerAudit);
  if (audit.pagesScanned === 0) {
    return NextResponse.json(
      { site, warning: "Site ajouté, mais aucune page n'a pu être analysée (site inaccessible ?). Relancez l'audit depuis le tableau de bord." },
      { status: 207 }
    );
  }
  saveAudit(audit);
  return NextResponse.json({ site, auditId: audit.id });
}
