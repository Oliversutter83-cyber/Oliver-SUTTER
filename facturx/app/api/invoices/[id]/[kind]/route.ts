import { NextResponse } from "next/server";
import { getInvoice, readInvoiceFile } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; kind: string }> }
) {
  const { id, kind } = await params;
  if (kind !== "pdf" && kind !== "xml") {
    return NextResponse.json({ error: "Format inconnu." }, { status: 400 });
  }
  const invoice = getInvoice(id);
  const file = invoice && readInvoiceFile(id, kind);
  if (!invoice || !file) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": kind === "pdf" ? "application/pdf" : "text/xml; charset=utf-8",
      "Content-Disposition": `inline; filename="${invoice.numero}.${kind}"`,
    },
  });
}
