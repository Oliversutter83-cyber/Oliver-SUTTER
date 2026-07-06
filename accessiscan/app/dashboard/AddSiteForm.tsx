"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddSiteForm({ firstSite }: { firstSite: boolean }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 207) {
        setError(data.error ?? "Erreur — réessayez.");
        return;
      }
      if (data.auditId) {
        router.push(`/dashboard/site/${data.site.id}`);
      } else {
        setError(data.warning ?? null);
        router.refresh();
      }
    } catch {
      setError("Erreur — réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="scanner-card" style={{ margin: "1.5rem 0 2rem", maxWidth: "none" }}>
      <form className="scan-form" onSubmit={submit}>
        <label htmlFor="site-url">
          {firstSite ? "Ajoutez votre premier site — l'audit complet démarre immédiatement" : "Ajouter un site"}
        </label>
        <input
          id="site-url"
          type="text"
          inputMode="url"
          placeholder="www.monsite.fr"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Audit en cours… (jusqu'à 1 min)" : "Ajouter et auditer"}
        </button>
      </form>
      {error && (
        <p className="scan-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
