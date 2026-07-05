// Point d'entrée du connecteur WooCommerce : reçoit une commande,
// génère la facture Factur-X (XML + PDF avec XML embarqué) et l'archive.
import { NextResponse } from "next/server";
import { buildFacturXXml } from "@/lib/cii";
import { buildInvoicePdf } from "@/lib/pdf";
import { createInvoice, saveInvoiceFiles } from "@/lib/store";
import type { OrderPayload } from "@/lib/types";

export async function POST(request: Request) {
  // Authentification par clé API (désactivée si FACTURX_API_KEY absent — mode démo)
  const expected = process.env.FACTURX_API_KEY;
  if (expected && request.headers.get("x-api-key") !== expected) {
    return NextResponse.json({ error: "Clé API invalide." }, { status: 401 });
  }

  const order = (await request.json()) as OrderPayload;
  if (
    !order?.orderRef ||
    !order.buyer?.name ||
    !Array.isArray(order.lines) ||
    order.lines.length === 0 ||
    order.lines.some(
      (l) =>
        typeof l.quantity !== "number" ||
        typeof l.unitPriceHT !== "number" ||
        typeof l.vatRate !== "number"
    )
  ) {
    return NextResponse.json({ error: "Commande invalide." }, { status: 400 });
  }

  const invoice = createInvoice(order);
  const xml = buildFacturXXml(invoice);
  const pdf = await buildInvoicePdf(invoice, xml);
  saveInvoiceFiles(invoice.id, pdf, xml);

  return NextResponse.json(
    { id: invoice.id, numero: invoice.numero, status: invoice.status },
    { status: 201 }
  );
}
