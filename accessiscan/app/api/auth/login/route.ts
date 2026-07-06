// Connexion par lien magique : email → lien signé envoyé par email.
// Réponse identique que le compte existe ou non (pas d'énumération d'emails).
import { NextResponse } from "next/server";
import { getCustomerByEmail } from "@/lib/store";
import { sendEmail, loginEmail } from "@/lib/email";
import { config } from "@/lib/config";

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const customer = getCustomerByEmail(email);
  let demoUrl: string | undefined;
  if (customer) {
    const loginUrl = `${config.appUrl}/api/auth/verify?token=${customer.token}`;
    const sent = await sendEmail(email, "Votre lien de connexion AccessiScan", loginEmail(loginUrl));
    // Sans fournisseur d'email configuré (démo/local), on renvoie le lien à l'écran.
    if (!sent && !config.email.enabled) demoUrl = loginUrl;
  }

  return NextResponse.json({
    ok: true,
    message: "Si un compte existe pour cet email, un lien de connexion vient d'être envoyé.",
    ...(demoUrl ? { demoUrl } : {}),
  });
}
