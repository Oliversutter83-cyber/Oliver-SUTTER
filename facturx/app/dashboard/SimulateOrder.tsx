"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SAMPLE_ORDER = {
  orderRef: "WC-1042",
  buyer: {
    name: "Studio Lemaire EURL",
    address: "4 avenue de la République, 69003 Lyon",
    siren: "987654321",
    vatNumber: "FR12987654321",
  },
  lines: [
    { name: "Lampe de bureau Nova", quantity: 2, unitPriceHT: 74.9, vatRate: 20 },
    { name: "Ampoule LED E27 (lot de 4)", quantity: 1, unitPriceHT: 19.5, vatRate: 20 },
    { name: "Livraison Colissimo", quantity: 1, unitPriceHT: 6.9, vatRate: 20 },
  ],
};

export default function SimulateOrder() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function simulate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...SAMPLE_ORDER,
          orderRef: `WC-${1000 + Math.floor(Math.random() * 9000)}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erreur.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <strong>Tester sans boutique</strong>
      <p className="muted">
        Simule la réception d&apos;une commande WooCommerce : la facture Factur-X (PDF + XML
        embarqué) est générée instantanément.
      </p>
      <button className="btn btn-primary" onClick={simulate} disabled={busy}>
        {busy ? "Génération…" : "🛒 Simuler une commande"}
      </button>
      {error && <p style={{ color: "#b3392f" }}>{error}</p>}
    </div>
  );
}
