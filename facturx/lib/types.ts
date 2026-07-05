export interface Party {
  name: string;
  address?: string | null;
  siren?: string | null;
  vatNumber?: string | null;
}

export interface InvoiceLine {
  name: string;
  quantity: number;
  unitPriceHT: number; // euros
  vatRate: number; // 20, 10, 5.5, 2.1, 0
}

export type InvoiceStatus = "generee" | "transmise";

export interface Invoice {
  id: string;
  numero: string; // FA-2026-0001
  orderRef: string; // référence de la commande WooCommerce
  buyer: Party;
  lines: InvoiceLine[];
  issuedAt: string;
  status: InvoiceStatus;
}

export interface OrderPayload {
  orderRef: string;
  buyer: Party;
  lines: InvoiceLine[];
}

export function lineTotalHT(l: InvoiceLine): number {
  return round2(l.quantity * l.unitPriceHT);
}

export function invoiceTotalHT(lines: InvoiceLine[]): number {
  return round2(lines.reduce((s, l) => s + lineTotalHT(l), 0));
}

/** Ventilation de la TVA par taux — requis par la norme EN 16931. */
export function vatBreakdown(lines: InvoiceLine[]): { rate: number; baseHT: number; vat: number }[] {
  const byRate = new Map<number, number>();
  for (const l of lines) {
    byRate.set(l.vatRate, round2((byRate.get(l.vatRate) ?? 0) + lineTotalHT(l)));
  }
  return [...byRate.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([rate, baseHT]) => ({ rate, baseHT, vat: round2((baseHT * rate) / 100) }));
}

export function invoiceTotalTVA(lines: InvoiceLine[]): number {
  return round2(vatBreakdown(lines).reduce((s, b) => s + b.vat, 0));
}

export function invoiceTotalTTC(lines: InvoiceLine[]): number {
  return round2(invoiceTotalHT(lines) + invoiceTotalTVA(lines));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
