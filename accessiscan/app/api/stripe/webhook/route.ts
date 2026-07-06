// Webhook Stripe : la source de vérité de l'activation des comptes.
// checkout.session.completed → compte actif + email de bienvenue avec accès.
// customer.subscription.deleted → compte désactivé.
import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/stripe";
import { upsertCustomer, cancelCustomerBySubscription } from "@/lib/store";
import { sendEmail, welcomeEmail } from "@/lib/email";
import { config } from "@/lib/config";

export async function POST(request: Request) {
  const payload = await request.text();
  if (!verifyWebhookSignature(payload, request.headers.get("stripe-signature"))) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  const event = JSON.parse(payload);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email: string | undefined = session.customer_details?.email ?? session.customer_email;
      if (session.payment_status === "paid" && email) {
        const customer = upsertCustomer({
          email,
          plan: session.metadata?.plan === "agence" ? "agence" : "pro",
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        });
        const loginUrl = `${config.appUrl}/api/auth/verify?token=${customer.token}`;
        await sendEmail(email, "Votre accès AccessiScan est prêt", welcomeEmail(loginUrl, customer.plan));
      }
      break;
    }
    case "customer.subscription.deleted": {
      cancelCustomerBySubscription(event.data.object.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
