import { NextResponse } from "next/server";
import { genererDevis } from "@/lib/ai";

export async function POST(request: Request) {
  const { transcript } = (await request.json()) as { transcript?: string };
  if (!transcript?.trim()) {
    return NextResponse.json({ error: "Dictée vide." }, { status: 400 });
  }
  try {
    const devis = await genererDevis(transcript.trim());
    return NextResponse.json(devis);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur de génération.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
