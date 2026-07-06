// Départ du tunnel d'achat : bouton tarif → session Stripe Checkout → paiement carte.
// Sans clés Stripe configurées : mode démonstration (parcours complet testable).
import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  const { plan, email } = (await request.json()) as { plan?: string; email?: string };
  const normalizedPlan = plan === "agence" ? "agence" : "pro";

  if (!config.stripe.enabled) {
    // Mode démo : on simule un paiement réussi pour tester le parcours entier.
    const params = new URLSearchParams({ demo: "1", plan: normalizedPlan, ...(email ? { email } : {}) });
    return NextResponse.json({ url: `/success?${params.toString()}`, demo: true });
  }

  try {
    const url = await createCheckoutSession(normalizedPlan, email);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("checkout:", e);
    return NextResponse.json(
      { error: "Impossible de démarrer le paiement. Réessayez ou écrivez-nous : contact@accessiscan.fr" },
      { status: 500 }
    );
  }
}
