// Stockage JSON + fichiers sur disque — volontairement minimal pour le MVP.
// À remplacer par Postgres + stockage objet (S3) avant production.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { Invoice, OrderPayload } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "invoices.json");
const FILES_DIR = path.join(DATA_DIR, "files");

function readAll(): Invoice[] {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) as Invoice[];
  } catch {
    return [];
  }
}

function writeAll(invoices: Invoice[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(invoices, null, 2));
}

export function listInvoices(): Invoice[] {
  return readAll().sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
}

export function getInvoice(id: string): Invoice | undefined {
  return readAll().find((i) => i.id === id);
}

export function createInvoice(order: OrderPayload): Invoice {
  const all = readAll();
  const now = new Date();
  const invoice: Invoice = {
    id: crypto.randomUUID(),
    numero: `FA-${now.getFullYear()}-${String(all.length + 1).padStart(4, "0")}`,
    orderRef: order.orderRef,
    buyer: order.buyer,
    lines: order.lines,
    issuedAt: now.toISOString(),
    status: "generee",
  };
  all.push(invoice);
  writeAll(all);
  return invoice;
}

export function saveInvoiceFiles(id: string, pdf: Uint8Array, xml: string): void {
  fs.mkdirSync(FILES_DIR, { recursive: true });
  fs.writeFileSync(path.join(FILES_DIR, `${id}.pdf`), pdf);
  fs.writeFileSync(path.join(FILES_DIR, `${id}.xml`), xml);
}

export function readInvoiceFile(id: string, kind: "pdf" | "xml"): Buffer | undefined {
  // id provient toujours du store (UUID) — pas de traversée de chemin possible,
  // mais on garde la validation par prudence.
  if (!/^[0-9a-f-]{36}$/.test(id)) return undefined;
  try {
    return fs.readFileSync(path.join(FILES_DIR, `${id}.${kind}`));
  } catch {
    return undefined;
  }
}
