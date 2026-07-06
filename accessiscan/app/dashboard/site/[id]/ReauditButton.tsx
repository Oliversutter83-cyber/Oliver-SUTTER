"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReauditButton({ siteId }: { siteId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur — réessayez.");
        return;
      }
      router.refresh();
    } catch {
      setError("Erreur — réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button type="button" className="btn btn-primary btn-sm" onClick={run} disabled={loading}>
        {loading ? "Audit en cours…" : "Relancer l'audit"}
      </button>
      {error && (
        <p className="scan-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
