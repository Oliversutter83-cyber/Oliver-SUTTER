# FacturX Connect — Document de cadrage

*Version 1.0 — juillet 2026 · Produit prioritaire (le SaaS artisans reste en réserve, voir BUSINESS-PLAN.md)*

## 1. Vision

**Rendre n'importe quelle boutique e-commerce française conforme à la facturation électronique en 5 minutes, sans jamais parler à un commercial.** Un plugin s'installe, les factures Factur-X se génèrent toutes seules, l'abonnement tourne.

## 2. Le déclencheur : une obligation légale datée

- **Septembre 2026** : toutes les entreprises françaises doivent pouvoir *recevoir* des factures électroniques ; grandes entreprises et ETI doivent en *émettre*.
- **Septembre 2027** : obligation d'émission étendue aux TPE/PME et micro-entreprises.
- Formats imposés : **Factur-X**, UBL ou CII, transmis via une plateforme agréée (PDP) ou le portail public.
- **WooCommerce et PrestaShop ne sont pas conformes en standard.** Chaque boutique française devra installer une solution.

C'est une demande captive, datée, créée par la loi — pas un besoin à évangéliser.

## 3. Pourquoi ce business est « sans appels »

| Étape du client | Canal | Contact humain |
|---|---|---|
| Découverte | Google (« facture électronique WooCommerce »), répertoire d'extensions | Aucun |
| Essai | Installation du plugin + compte gratuit | Aucun |
| Achat | Checkout carte (Stripe) | Aucun |
| Support | Email / base de connaissances | Email uniquement |

Le seul sujet non-self-serve (raccordement PDP) se traite par email/API et n'est nécessaire qu'en V2.

## 4. Cible

- **Cœur** : boutiques WooCommerce françaises (plusieurs centaines de milliers), tenues par des indépendants et TPE sans DSI.
- **Extension** : PrestaShop (très fort en France), puis Shopify (app store).
- **Prescripteurs passifs** : agences web qui maintiennent des parcs de boutiques — un seul article « comment mettre vos clients en conformité » peut en convertir en cascade, sans appel.

## 5. Produit

### MVP (ce dépôt — `facturx/`)
- API recevant les commandes WooCommerce (connecteur PHP fourni)
- Génération **XML CII profil BASIC (EN 16931)** + **PDF avec XML embarqué**
- Tableau de bord : factures générées, volume, téléchargements PDF/XML
- Simulateur de commande pour tester sans boutique

### V1 (2-3 mois)
- Comptes marchands + Stripe billing, PDF/A-3 certifié, validation XSD/Schematron
- Envoi automatique de la facture au client final
- Numérotation légale paramétrable, mentions obligatoires complètes

### V2 (avant sept. 2026 — le pic de demande)
- **Transmission via PDP** (choisir une plateforme à parcours 100 % en ligne)
- Réception des factures fournisseurs (obligation de réception = tout le monde dès 2026)
- Archivage légal 10 ans

### V3
- Connecteurs PrestaShop puis Shopify
- Offre agences (multi-boutiques), API publique

## 6. Modèle économique

- **Freemium** : 10 factures/mois gratuites (le pied dans la porte, et le moteur du bouche-à-oreille).
- **Standard 19 €/mois** : factures illimitées, envoi client, archivage.
- **Pro 39 €/mois** : transmission PDP, réception fournisseurs, multi-boutiques.

| Boutiques payantes | ARR (panier moyen ~19 €) |
|---|---|
| 500 | ~115 k€ |
| 2 000 | ~450 k€ |
| 5 000 | ~1,1 M€ |

Capter 1-2 % des boutiques WooCommerce/PrestaShop françaises pendant la vague 2026-2027 suffit à dépasser 1 M€ d'ARR, en solo, à ~90 % de marge.

## 7. Distribution (zéro appel)

1. **SEO de panique** : publier *avant* le pic — « WooCommerce est-il conforme ? », simulateur d'amendes, checklist 2026, comparatifs. La demande explosera mécaniquement à l'approche de sept. 2026.
2. **Répertoire WordPress.org** : version gratuite du plugin = canal d'acquisition permanent.
3. **Contenu pour agences web** : guides techniques que les agences suivent pour leurs clients.

## 8. Concurrence

Des plugins émergent (e-facturX, FactureXPress, extension-wp) — marché en formation, personne n'a gagné. Différenciation : **l'expérience la plus simple** (installé → conforme en 5 min), le **meilleur contenu SEO**, et l'architecture SaaS (les plugins purs vendent une licence unique ; nous vendons un service récurrent : transmission, archivage, mises à jour réglementaires).

## 9. Risques

- **Fenêtre temporelle** : le gros de la valeur se joue en 2026-2027 → exécuter vite, contenu SEO dès maintenant.
- **Évolutions réglementaires** : calendrier déjà reporté par le passé → veille active ; un report *élargit* la fenêtre.
- **Conformité technique** (PDF/A-3, Schematron) : investissement initial réel → c'est aussi la barrière à l'entrée qui protège des clones à bas coût.
- **Dépendance PDP** (V2) : choisir une plateforme à onboarding en ligne ; en supporter deux à terme.

## 10. KPIs

- Trafic SEO sur les pages « conformité » et position sur « facture électronique woocommerce »
- Installations plugin gratuites / conversions payantes
- Factures générées / semaine (l'usage = la rétention)
- MRR et churn mensuel
