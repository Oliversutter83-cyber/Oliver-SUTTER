// Configuration centralisée — tout vient des variables d'environnement,
// avec un mode démonstration complet quand Stripe/Resend ne sont pas branchés
// (le parcours d'achat entier reste testable en local).

export const config = {
  appUrl: process.env.APP_URL ?? "http://localhost:3000",

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    pricePro: process.env.STRIPE_PRICE_PRO ?? "",
    priceAgence: process.env.STRIPE_PRICE_AGENCE ?? "",
    get enabled() {
      return Boolean(this.secretKey && this.pricePro && this.priceAgence);
    },
  },

  email: {
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    from: process.env.EMAIL_FROM ?? "AccessiScan <contact@accessiscan.fr>",
    get enabled() {
      return Boolean(this.resendApiKey);
    },
  },

  cronSecret: process.env.CRON_SECRET ?? "",

  // Autorise le scan d'hôtes locaux — UNIQUEMENT pour les tests de développement.
  allowLocalScan: process.env.ALLOW_LOCAL_SCAN === "1",
};

export const SESSION_COOKIE = "as_session";
