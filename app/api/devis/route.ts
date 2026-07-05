import { NextResponse } from "next/server";
import { createDevis, listDevis } from "@/lib/store";
import type { Devis } from "@/lib/types";

export async function GET() {
  return NextResponse.json(listDevis());
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<
    Devis,
    "id" | "numero" | "status" | "createdAt" | "updatedAt"
  >;
  if (!body?.titre || !Array.isArray(body.lignes) || body.lignes.length === 0) {
    return NextResponse.json({ error: "Devis invalide." }, { status: 400 });
  }
  const devis = createDevis(body);
  return NextResponse.json(devis, { status: 201 });
}
