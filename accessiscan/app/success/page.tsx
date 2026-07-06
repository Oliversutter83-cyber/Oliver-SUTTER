// Retour de Stripe Checkout : on active le compte et on ouvre la session.
// Le webhook reste la source de vérité ; cette page couvre le cas où le client
// revient avant que le webhook soit traité, et le mode démonstration.
import { redirect } from "next/navigation";
import { config } from "@/lib/config";
import { retrieveCheckoutSession } from "@/lib/stripe";
import { upsertCustomer } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; demo?: string; plan?: string; email?: string }>;
}) {
  const params = await searchParams;

  // Mode démonstration — uniquement quand Stripe n'est pas configuré.
  if (params.demo === "1" && !config.stripe.enabled) {
    const customer = upsertCustomer({
      email: params.email || "demo@accessiscan.fr",
      plan: params.plan === "agence" ? "agence" : "pro",
      demo: true,
    });
    redirect(`/api/auth/verify?token=${customer.token}`);
  }

  if (params.session_id && config.stripe.enabled) {
    try {
      const session = await retrieveCheckoutSession(params.session_id);
      if (session.paid && session.email) {
        const customer = upsertCustomer({
          email: session.email,
          plan: session.plan,
          stripeCustomerId: session.customerId,
          stripeSubscriptionId: session.subscriptionId,
        });
        redirect(`/api/auth/verify?token=${customer.token}`);
      }
    } catch (e) {
      // NEXT_REDIRECT est le fonctionnement normal de redirect() — on le laisse passer.
      if ((e as Error & { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw e;
      console.error("success:", e);
    }
  }

  return (
    <section className="section">
      <h1>Paiement reçu — votre accès arrive</h1>
      <p className="lead">
        Votre compte est en cours d'activation. Vous allez recevoir un email avec votre lien d'accès
        d'ici une minute. Vous pouvez aussi demander le lien directement :
      </p>
      <p>
        <a href="/login" className="btn btn-primary">
          Recevoir mon lien de connexion
        </a>
      </p>
    </section>
  );
}
