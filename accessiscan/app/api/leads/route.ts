// Capture d'emails — même mécanique éprouvée que FacturX Connect.
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

export async function POST(request: Request) {
  const { email, source } = (await request.json()) as { email?: string; source?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }
  let leads: { email: string; source?: string; at: string }[] = [];
  try {
    leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
  } catch {
    /* première inscription */
  }
  if (!leads.some((l) => l.email === email.toLowerCase())) {
    leads.push({ email: email.toLowerCase(), source, at: new Date().toISOString() });
    fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  }
  return NextResponse.json({ ok: true });
}
