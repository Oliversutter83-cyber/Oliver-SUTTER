"use client";

// Bouton d'achat : un clic → Stripe Checkout (ou parcours démo sans clés).
// Aucune inscription préalable : l'email est saisi chez Stripe, le compte est
// créé automatiquement au paiement. Le client achète, tout le reste suit.
import { useState } from "react";

export default function CheckoutButton({
  plan,
  label,
  variant = "primary",
}: {
  plan: "pro" | "agence";
  label: string;
  variant?: "primary" | "ghost";
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Erreur — réessayez.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Erreur — réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`btn btn-${variant}`}
        onClick={buy}
        disabled={loading}
        style={{ marginTop: "auto" }}
      >
        {loading ? "Redirection…" : label}
      </button>
      {error && (
        <p className="scan-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
