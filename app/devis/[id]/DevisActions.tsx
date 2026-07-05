"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DevisStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

export default function DevisActions({
  id,
  status,
}: {
  id: string;
  status: DevisStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: DevisStatus) {
    setBusy(true);
    await fetch(`/api/devis/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="actions no-print">
      <span className={`badge badge-${status}`} style={{ alignSelf: "center" }}>
        {STATUS_LABELS[status]}
      </span>
      {status === "brouillon" && (
        <button className="btn btn-primary" onClick={() => setStatus("envoye")} disabled={busy}>
          📤 Marquer envoyé
        </button>
      )}
      {status === "envoye" && (
        <>
          <button className="btn btn-primary" onClick={() => setStatus("signe")} disabled={busy}>
            ✅ Signé
          </button>
          <button className="btn" onClick={() => setStatus("refuse")} disabled={busy}>
            ❌ Refusé
          </button>
        </>
      )}
      <button className="btn" onClick={() => window.print()}>
        🖨️ Imprimer / PDF
      </button>
    </div>
  );
}
