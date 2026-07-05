// Génération du PDF de facture avec le XML Factur-X embarqué en pièce jointe
// (structure "PDF + XML" du format Factur-X).
//
// ⚠️ MVP : pdf-lib produit un PDF standard avec pièce jointe AFRelationship.
// La conformité PDF/A-3 complète (métadonnées XMP, profils couleur) est
// l'étape suivante — via post-traitement Ghostscript ou lib dédiée.
import {
  AFRelationship,
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";
import { SELLER } from "./config";
import {
  Invoice,
  invoiceTotalHT,
  invoiceTotalTTC,
  invoiceTotalTVA,
  lineTotalHT,
  vatBreakdown,
} from "./types";

const euro = (n: number) => `${n.toFixed(2).replace(".", ",")} EUR`;

export async function buildInvoicePdf(invoice: Invoice, xml: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.13, 0.13, 0.11);
  const muted = rgb(0.43, 0.42, 0.38);

  let y = 800;
  const text = (
    s: string,
    x: number,
    opts: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb> } = {}
  ) => {
    page.drawText(s, {
      x,
      y,
      size: opts.size ?? 10,
      font: opts.bold ? bold : font,
      color: opts.color ?? ink,
    });
  };

  text(`FACTURE ${invoice.numero}`, 40, { size: 18, bold: true });
  y -= 16;
  text(`Émise le ${invoice.issuedAt.slice(0, 10)} — Réf. commande ${invoice.orderRef}`, 40, {
    color: muted,
  });

  y -= 40;
  text("Vendeur", 40, { bold: true });
  text("Client", 320, { bold: true });
  y -= 14;
  text(SELLER.name, 40);
  text(invoice.buyer.name, 320);
  y -= 12;
  text(SELLER.address, 40, { size: 9, color: muted });
  if (invoice.buyer.address) text(invoice.buyer.address, 320, { size: 9, color: muted });
  y -= 12;
  text(`SIREN ${SELLER.siren} — TVA ${SELLER.vatNumber}`, 40, { size: 9, color: muted });
  if (invoice.buyer.vatNumber) text(`TVA ${invoice.buyer.vatNumber}`, 320, { size: 9, color: muted });

  // Tableau des lignes
  y -= 36;
  text("Désignation", 40, { bold: true, size: 9 });
  text("Qté", 330, { bold: true, size: 9 });
  text("PU HT", 380, { bold: true, size: 9 });
  text("TVA", 450, { bold: true, size: 9 });
  text("Total HT", 495, { bold: true, size: 9 });
  y -= 6;
  page.drawLine({ start: { x: 40, y }, end: { x: 555, y }, thickness: 0.7, color: muted });

  for (const l of invoice.lines) {
    y -= 16;
    text(l.name.slice(0, 55), 40, { size: 9 });
    text(String(l.quantity), 330, { size: 9 });
    text(euro(l.unitPriceHT), 380, { size: 9 });
    text(`${l.vatRate} %`, 450, { size: 9 });
    text(euro(lineTotalHT(l)), 495, { size: 9 });
  }

  y -= 10;
  page.drawLine({ start: { x: 40, y }, end: { x: 555, y }, thickness: 0.7, color: muted });

  // Totaux + ventilation TVA
  y -= 20;
  text(`Total HT : ${euro(invoiceTotalHT(invoice.lines))}`, 400);
  for (const b of vatBreakdown(invoice.lines)) {
    y -= 14;
    text(`TVA ${b.rate} % sur ${euro(b.baseHT)} : ${euro(b.vat)}`, 400, { size: 9, color: muted });
  }
  y -= 14;
  text(`Total TVA : ${euro(invoiceTotalTVA(invoice.lines))}`, 400, { size: 9, color: muted });
  y -= 18;
  text(`Total TTC : ${euro(invoiceTotalTTC(invoice.lines))}`, 400, { size: 12, bold: true });

  y = 50;
  text("Facture électronique au format Factur-X — données structurées embarquées (factur-x.xml).", 40, {
    size: 8,
    color: muted,
  });

  // Pièce jointe Factur-X : le XML CII embarqué dans le PDF
  await doc.attach(new TextEncoder().encode(xml), "factur-x.xml", {
    mimeType: "text/xml",
    description: "Factur-X invoice data (EN 16931, profil BASIC)",
    creationDate: new Date(invoice.issuedAt),
    modificationDate: new Date(invoice.issuedAt),
    afRelationship: AFRelationship.Data,
  });

  return doc.save();
}
