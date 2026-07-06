// Persistance JSON locale derrière une interface propre.
// MVP : fichiers dans data/ (nécessite un hébergement à disque persistant —
// Railway, VPS, Fly). Le jour où on passe à Postgres, seul ce fichier change.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { AuditResult } from "./audit";

const DATA_DIR = path.join(process.cwd(), "data");

export type Plan = "pro" | "agence";

export interface Customer {
  id: string;
  email: string;
  plan: Plan;
  token: string; // jeton de session/connexion (magic link + cookie)
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: "active" | "canceled";
  demo?: boolean;
  createdAt: string;
}

export interface Site {
  id: string;
  customerId: string;
  url: string; // origine normalisée, ex. https://www.boutique.fr
  createdAt: string;
}

export interface SiteAudit {
  id: string;
  siteId: string;
  startedAt: string;
  finishedAt: string;
  pagesScanned: number;
  globalScore: number; // moyenne des pages
  risk: AuditResult["risk"];
  pages: AuditResult[];
}

/* ---------- Helpers fichiers ---------- */

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, value: unknown) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, target);
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(9).toString("base64url")}`;
}

export function newToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/* ---------- Clients ---------- */

export function listCustomers(): Customer[] {
  return readJson<Customer[]>("customers.json", []);
}

export function getCustomerByToken(token: string): Customer | undefined {
  if (!token) return undefined;
  return listCustomers().find((c) => c.token === token && c.status === "active");
}

export function getCustomerByEmail(email: string): Customer | undefined {
  return listCustomers().find((c) => c.email === email.toLowerCase());
}

export function upsertCustomer(input: {
  email: string;
  plan: Plan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  demo?: boolean;
}): Customer {
  const customers = listCustomers();
  const email = input.email.toLowerCase();
  let customer = customers.find((c) => c.email === email);
  if (customer) {
    customer.plan = input.plan;
    customer.status = "active";
    customer.stripeCustomerId = input.stripeCustomerId ?? customer.stripeCustomerId;
    customer.stripeSubscriptionId = input.stripeSubscriptionId ?? customer.stripeSubscriptionId;
    customer.demo = input.demo ?? customer.demo;
  } else {
    customer = {
      id: newId("cus"),
      email,
      plan: input.plan,
      token: newToken(),
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      status: "active",
      demo: input.demo,
      createdAt: new Date().toISOString(),
    };
    customers.push(customer);
  }
  writeJson("customers.json", customers);
  return customer;
}

export function cancelCustomerBySubscription(subscriptionId: string) {
  const customers = listCustomers();
  const customer = customers.find((c) => c.stripeSubscriptionId === subscriptionId);
  if (customer) {
    customer.status = "canceled";
    writeJson("customers.json", customers);
  }
}

/* ---------- Sites ---------- */

export function listSites(customerId?: string): Site[] {
  const sites = readJson<Site[]>("sites.json", []);
  return customerId ? sites.filter((s) => s.customerId === customerId) : sites;
}

export function getSite(id: string): Site | undefined {
  return listSites().find((s) => s.id === id);
}

export const PLAN_LIMITS: Record<Plan, { sites: number; pagesPerAudit: number }> = {
  pro: { sites: 1, pagesPerAudit: 25 },
  agence: { sites: 20, pagesPerAudit: 15 },
};

export function addSite(customer: Customer, url: string): Site | { error: string } {
  const sites = listSites();
  const mine = sites.filter((s) => s.customerId === customer.id);
  if (mine.length >= PLAN_LIMITS[customer.plan].sites) {
    return {
      error:
        customer.plan === "pro"
          ? "L'offre Pro couvre 1 site. Passez à l'offre Agence pour en suivre jusqu'à 20."
          : "Limite de 20 sites atteinte. Contactez-nous pour un palier supérieur.",
    };
  }
  let origin: string;
  try {
    origin = new URL(/^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`).origin;
  } catch {
    return { error: "Adresse invalide." };
  }
  if (mine.some((s) => s.url === origin)) return { error: "Ce site est déjà suivi." };
  const site: Site = { id: newId("site"), customerId: customer.id, url: origin, createdAt: new Date().toISOString() };
  sites.push(site);
  writeJson("sites.json", sites);
  return site;
}

/* ---------- Audits ---------- */

const MAX_AUDITS_PER_SITE = 12; // ~1 an de surveillance mensuelle

export function listAudits(siteId: string): SiteAudit[] {
  return readJson<SiteAudit[]>("audits.json", [])
    .filter((a) => a.siteId === siteId)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export function getAudit(id: string): SiteAudit | undefined {
  return readJson<SiteAudit[]>("audits.json", []).find((a) => a.id === id);
}

export function saveAudit(audit: SiteAudit) {
  let audits = readJson<SiteAudit[]>("audits.json", []);
  audits.push(audit);
  // Rotation : on garde l'historique récent de chaque site.
  const bySite = new Map<string, SiteAudit[]>();
  for (const a of audits) {
    const list = bySite.get(a.siteId) ?? [];
    list.push(a);
    bySite.set(a.siteId, list);
  }
  audits = [...bySite.values()].flatMap((list) =>
    list.sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, MAX_AUDITS_PER_SITE)
  );
  writeJson("audits.json", audits);
}
