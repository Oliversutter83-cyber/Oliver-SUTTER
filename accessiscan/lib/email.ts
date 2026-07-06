// Envoi d'emails transactionnels via Resend (simple appel REST, zéro SDK).
// Sans clé API : mode démo — l'action renvoie le lien à afficher à l'écran,
// le parcours reste fonctionnel de bout en bout.
import { config } from "./config";

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!config.email.enabled) {
    console.log(`[email démo] à: ${to} — ${subject}`);
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.email.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: config.email.from, to: [to], subject, html }),
  });
  return res.ok;
}

const layout = (body: string) => `
  <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #14162b;">
    <p style="font-weight: 800; font-size: 18px; color: #1a1d5c;">Accessi<span style="color:#2b2fa8;">Scan</span></p>
    ${body}
    <p style="color: #5c5f7e; font-size: 13px; margin-top: 32px;">
      AccessiScan — audit d'accessibilité RGAA et déclaration légale.<br/>
      Une question ? Répondez simplement à cet email.
    </p>
  </div>`;

export function welcomeEmail(loginUrl: string, plan: string) {
  return layout(`
    <h2>Bienvenue — votre espace est prêt</h2>
    <p>Votre abonnement <strong>${plan === "agence" ? "Agence" : "Pro"}</strong> est actif. Accédez à votre tableau de bord pour ajouter votre ${plan === "agence" ? "premier site client" : "site"} et lancer l'audit complet :</p>
    <p><a href="${loginUrl}" style="display:inline-block;background:#2b2fa8;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:700;">Accéder à mon tableau de bord</a></p>
    <p style="color:#5c5f7e;font-size:14px;">Conservez cet email : ce lien est votre accès permanent. Vous pouvez aussi en recevoir un nouveau à tout moment depuis la page de connexion.</p>
  `);
}

export function loginEmail(loginUrl: string) {
  return layout(`
    <h2>Votre lien de connexion</h2>
    <p><a href="${loginUrl}" style="display:inline-block;background:#2b2fa8;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:700;">Me connecter à AccessiScan</a></p>
    <p style="color:#5c5f7e;font-size:14px;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
  `);
}

export function regressionEmail(siteUrl: string, oldScore: number, newScore: number, dashboardUrl: string) {
  return layout(`
    <h2 style="color:#b3261e;">⚠ Régression d'accessibilité détectée</h2>
    <p>La surveillance mensuelle de <strong>${siteUrl}</strong> a détecté une baisse de score : <strong>${oldScore} → ${newScore}</strong>/100.</p>
    <p>Une mise à jour du site (thème, extension, contenu) a probablement introduit de nouvelles non-conformités.</p>
    <p><a href="${dashboardUrl}" style="display:inline-block;background:#2b2fa8;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:700;">Voir le détail</a></p>
  `);
}

export function monitoringOkEmail(siteUrl: string, score: number, reportUrl: string) {
  return layout(`
    <h2>Surveillance mensuelle : rien à signaler</h2>
    <p><strong>${siteUrl}</strong> maintient un score de <strong>${score}/100</strong>. Le rapport horodaté de ce mois est disponible — c'est votre preuve de démarche continue en cas de contrôle :</p>
    <p><a href="${reportUrl}" style="display:inline-block;background:#2b2fa8;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:700;">Télécharger le rapport</a></p>
  `);
}
