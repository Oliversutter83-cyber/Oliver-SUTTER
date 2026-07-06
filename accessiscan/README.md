# ♿ AccessiScan

**L'audit d'accessibilité RGAA automatisé et la déclaration légale, pour les sites concernés par la directive européenne accessibilité (EAA).**

> 📊 Cadrage business : [`../docs/BUSINESS-PLAN-ACCESSISCAN.md`](../docs/BUSINESS-PLAN-ACCESSISCAN.md) · Plan des 14 premiers jours : [`../docs/GUIDE-PREMIERS-REVENUS-ACCESSISCAN.md`](../docs/GUIDE-PREMIERS-REVENUS-ACCESSISCAN.md)

## Le produit (MVP)

1. **🔍 Scanner en ligne** — une URL → score /100, non-conformités RGAA (avec extraits de code fautifs et corrections), niveau de risque juridique. L'aimant à trafic.
2. **📄 Générateur de déclaration d'accessibilité** — le document légal obligatoire (article 47, loi n° 2005-102), généré conforme au modèle officiel. Gratuit contre email : l'aimant à leads.
3. **🔌 Plugin WordPress** (`wp-plugin/accessiscan/`) — audit en un clic depuis wp-admin + déclaration pré-remplie. Destiné au répertoire WordPress.org : le canal d'acquisition permanent.
4. **📰 Blog SEO** — 3 articles ciblant les recherches « de panique » (amendes, déclaration obligatoire, checklist e-commerce).

## Démarrage

```bash
cd accessiscan
npm install
npm run dev        # http://localhost:3000
```

Aucune clé API nécessaire : le scanner fonctionne en autonomie complète.

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
  declaration/                # Générateur de déclaration (lead magnet)
  blog/                       # Articles SEO markdown
  api/scan/route.ts           # Fetch de la page cible + audit
  api/leads/route.ts          # Capture d'emails
lib/
  audit.ts                    # Moteur d'audit RGAA (l'actif technique)
  declaration.ts              # Génération du texte légal
  blog.ts                     # Chargeur markdown
content/blog/                 # 3 articles SEO
wp-plugin/accessiscan/        # Plugin WordPress (canal d'acquisition)
```

## Prochaines étapes (V1 — déclenche les abonnements)

- [ ] Stripe billing (29 €/site/mois Pro, 149 €/mois Agence) + comptes clients
- [ ] Crawl multi-pages (sitemap) — l'audit complet que le client paie
- [ ] Rapport PDF horodaté « à présenter en cas de contrôle »
- [ ] Surveillance mensuelle + alertes email
- [ ] Vérification des contrastes via rendu headless (V2 — le moat technique)
