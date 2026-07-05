import { NextResponse } from "next/server";
import { getDevis, updateDevis } from "@/lib/store";
import type { DevisStatus } from "@/lib/types";

const VALID_STATUS: DevisStatus[] = ["brouillon", "envoye", "signe", "refuse"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const devis = getDevis(id);
  if (!devis) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json(devis);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = (await request.json()) as { status?: DevisStatus };
  if (!status || !VALID_STATUS.includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }
  const devis = updateDevis(id, { status });
  if (!devis) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json(devis);
}
