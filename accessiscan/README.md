# ♿ AccessiScan

**L'audit d'accessibilité RGAA automatisé et la déclaration légale, pour les sites concernés par la directive européenne accessibilité (EAA).**

> 📊 Cadrage business : [`../docs/BUSINESS-PLAN-ACCESSISCAN.md`](../docs/BUSINESS-PLAN-ACCESSISCAN.md) · Plan des 14 premiers jours : [`../docs/GUIDE-PREMIERS-REVENUS-ACCESSISCAN.md`](../docs/GUIDE-PREMIERS-REVENUS-ACCESSISCAN.md)

## Le produit — 100 % self-serve : le client achète, tout le reste est automatique

**Gratuit (acquisition)**
1. **🔍 Scanner en ligne** — une URL → score /100, non-conformités RGAA (avec extraits de code fautifs et corrections), niveau de risque juridique. L'aimant à trafic.
2. **📄 Générateur de déclaration d'accessibilité** — le document légal obligatoire (article 47, loi n° 2005-102), généré conforme au modèle officiel. Gratuit contre email : l'aimant à leads.
3. **🔌 Plugin WordPress** (`wp-plugin/accessiscan/`) — audit en un clic depuis wp-admin + déclaration pré-remplie. Destiné au répertoire WordPress.org : le canal d'acquisition permanent.
4. **📰 Blog SEO** — 3 articles ciblant les recherches « de panique » (amendes, déclaration obligatoire, checklist e-commerce).

**Payant (le tunnel automatique)**
5. **💳 Achat en 1 clic** — bouton tarif → Stripe Checkout → paiement carte. Le compte est créé automatiquement au paiement (webhook + page de retour), l'accès arrive par email (lien magique, zéro mot de passe).
6. **📊 Tableau de bord client** — ajout du site → **audit multi-pages immédiat** (découverte via sitemap + liens internes, priorisation des pages business : produits, panier, contact…). Pro : 1 site / 25 pages ; Agence : 20 sites / 15 pages.
7. **🗂️ Plan d'action priorisé** — constats agrégés par type sur tout le site, pages concernées, correction à transmettre au développeur.
8. **📑 Rapport PDF horodaté** — référence unique, périmètre, synthèse juridique, résultats par page : la pièce à présenter en cas de contrôle.
9. **🛰️ Surveillance mensuelle** — cron de re-audit de tous les sites : email d'alerte en cas de régression, rapport mensuel sinon (la série de rapports = preuve de démarche continue).

## Démarrage

```bash
cd accessiscan
npm install
npm run dev        # http://localhost:3000
```

**Sans aucune clé API**, tout fonctionne en **mode démonstration** : le bouton d'achat simule un paiement réussi, les liens de connexion s'affichent à l'écran — le parcours complet (achat → compte → audit → rapport) est testable en local.

**Pour encaisser en production**, copier `.env.example` en `.env` et renseigner :
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_AGENCE`, `STRIPE_WEBHOOK_SECRET` (paiements réels)
- `RESEND_API_KEY` (emails d'accès et alertes)
- `CRON_SECRET` + le cron mensuel (`vercel.json` fourni, ou crontab `curl`)

> ⚠️ **Hébergement** : le stockage MVP est en fichiers JSON (`data/`) — il faut un disque persistant (Railway, VPS, Fly.io). Sur Vercel, les données seraient perdues à chaque déploiement : prévoir la migration Postgres (tout passe par `lib/store.ts`, seul fichier à changer).

Le plugin WordPress se teste en copiant `wp-plugin/accessiscan/` dans `wp-content/plugins/` d'un WordPress local, ou en zippant le dossier pour l'installer via wp-admin.

## Stack

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | Full-stack simple, déploiement Vercel en 1 clic |
| Moteur d'audit | Analyse statique maison (`lib/audit.ts`), zéro dépendance | 12 contrôles RGAA automatisables, portables (même logique en PHP dans le plugin) |
| Plugin WP | PHP natif + DOMDocument | Conforme aux règles du répertoire WordPress.org, aucune donnée envoyée à l'extérieur |
| Données | Fichiers JSON locaux (`data/`) | Zéro dépendance pour le MVP — à remplacer par Postgres en V1 |

## Structure

```
app/
  page.tsx                    # Landing : hero + scanner + loi + tarifs + FAQ
  ScanForm.tsx                # Scanner interactif (score, constats, CTA Pro)
  CheckoutButton.tsx          # Bouton d'achat → Stripe Checkout (ou démo)
  declaration/                # Générateur de déclaration (lead magnet)
  blog/                       # Articles SEO markdown
  success/                    # Retour Stripe : activation compte + session
  login/                      # Connexion par lien magique
  dashboard/                  # Espace client : sites, audits, plan d'action
  rapport/[id]/               # Rapport horodaté imprimable (PDF)
  api/
    scan/                     # Scanner public (1 page)
    leads/                    # Capture d'emails
    checkout/                 # Création de session Stripe Checkout
    stripe/webhook/           # Activation des comptes (signé)
    auth/{login,verify,logout}/ # Liens magiques + session cookie
    sites/                    # Ajout de site + premier audit
    audit/                    # Relance d'audit
    cron/monitor/             # Surveillance mensuelle (secret requis)
lib/
  audit.ts                    # Moteur d'audit RGAA (l'actif technique)
  crawl.ts                    # Crawl multi-pages + agrégation (l'offre payante)
  declaration.ts              # Génération du texte légal
  store.ts                    # Persistance (JSON MVP → Postgres en changeant ce seul fichier)
  stripe.ts                   # Checkout + webhook signé (REST, zéro SDK)
  email.ts                    # Emails transactionnels (Resend)
  auth.ts / config.ts / blog.ts
content/blog/                 # 3 articles SEO
wp-plugin/accessiscan/        # Plugin WordPress (canal d'acquisition)
vercel.json                   # Cron mensuel de surveillance
```

## Prochaines étapes (V2)

- [ ] Postgres (remplace `lib/store.ts`) + hébergement définitif
- [ ] Portail Stripe (gestion de l'abonnement par le client)
- [ ] Rapports en marque blanche pour l'offre Agence
- [ ] Vérification des contrastes via rendu headless — le moat technique
- [ ] Version anglaise/allemande (BFSG : amendes jusqu'à 500 k€)
