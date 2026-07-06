// Intégration Stripe par appels REST directs — pas de SDK, pas de dépendance.
// Checkout Sessions pour l'achat, webhook signé pour l'activation du compte.
import crypto from "crypto";
import { config } from "./config";
import type { Plan } from "./store";

const API = "https://api.stripe.com/v1";

function form(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}

async function stripeFetch(path: string, params?: Record<string, string>) {
  const res = await fetch(`${API}${path}`, {
    method: params ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${config.stripe.secretKey}`,
      ...(params ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: params ? form(params) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? `Stripe HTTP ${res.status}`);
  }
  return json;
}

export async function createCheckoutSession(plan: Plan, email?: string): Promise<string> {
  const price = plan === "agence" ? config.stripe.priceAgence : config.stripe.pricePro;
  const session = await stripeFetch("/checkout/sessions", {
    mode: "subscription",
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    success_url: `${config.appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.appUrl}/#tarifs`,
    "metadata[plan]": plan,
    "subscription_data[metadata][plan]": plan,
    locale: "fr",
    allow_promotion_codes: "true",
    ...(email ? { customer_email: email } : {}),
  });
  return session.url as string;
}

export async function retrieveCheckoutSession(sessionId: string) {
  const session = await stripeFetch(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
  return {
    paid: session.payment_status === "paid",
    email: (session.customer_details?.email ?? session.customer_email ?? "") as string,
    plan: (session.metadata?.plan === "agence" ? "agence" : "pro") as Plan,
    customerId: session.customer as string | undefined,
    subscriptionId: session.subscription as string | undefined,
  };
}

// Vérification de signature webhook (format t=...,v1=... signé HMAC-SHA256).
export function verifyWebhookSignature(payload: string, header: string | null): boolean {
  if (!header || !config.stripe.webhookSecret) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const idx = p.indexOf("=");
      return [p.slice(0, idx).trim(), p.slice(idx + 1)];
    })
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false; // anti-rejeu 5 min
  const expected = crypto
    .createHmac("sha256", config.stripe.webhookSecret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}
