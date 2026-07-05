// Stockage JSON sur disque — volontairement minimal pour le MVP.
// À remplacer par Postgres (Prisma/Drizzle) avant toute mise en production.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { Devis } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "devis.json");

function readAll(): Devis[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as Devis[];
  } catch {
    return [];
  }
}

function writeAll(devis: Devis[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(devis, null, 2));
}

export function listDevis(): Devis[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getDevis(id: string): Devis | undefined {
  return readAll().find((d) => d.id === id);
}

export function createDevis(
  input: Omit<Devis, "id" | "numero" | "status" | "createdAt" | "updatedAt">
): Devis {
  const all = readAll();
  const now = new Date();
  const devis: Devis = {
    ...input,
    id: crypto.randomUUID(),
    numero: `DEV-${now.getFullYear()}-${String(all.length + 1).padStart(4, "0")}`,
    status: "brouillon",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  all.push(devis);
  writeAll(all);
  return devis;
}

export function updateDevis(id: string, patch: Partial<Devis>): Devis | undefined {
  const all = readAll();
  const idx = all.findIndex((d) => d.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...patch, id, updatedAt: new Date().toISOString() };
  writeAll(all);
  return all[idx];
}
