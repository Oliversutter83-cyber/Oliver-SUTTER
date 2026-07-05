# 💶 Guide premiers revenus — FacturX Connect

*Écrit pour un débutant complet. Objectif : ton premier abonnement payant, sans passer un seul appel, avec un budget de démarrage inférieur à 30 €.*

---

## Vue d'ensemble : comment l'argent arrive

```
Un marchand panique ("suis-je conforme en 2026 ?")
   → il cherche sur Google
   → il tombe sur TON article
   → il installe ton plugin gratuit (10 factures/mois)
   → il dépasse 10 factures ou veut l'envoi automatique
   → il clique sur ton lien de paiement Stripe : 19 €/mois
   → l'argent arrive sur ton compte chaque mois, sans que tu fasses rien
```

Ton travail : publier du contenu qui capte les recherches, et améliorer le produit. C'est tout.

---

## Étape 1 — Créer ta micro-entreprise (gratuit, 100 % en ligne, ~1 h)

Il te faut un statut légal pour encaisser. La micro-entreprise est parfaite pour démarrer :

1. Va sur **procedures.inpi.fr** (le guichet unique officiel) → "Créer une entreprise".
2. Activité : **"Édition de logiciels applicatifs"** (ou "services numériques"). C'est une activité libérale non réglementée (BNC).
3. C'est **gratuit** (méfie-toi des sites qui font payer cette démarche).
4. Tu reçois ton SIREN sous ~2 semaines. Tu peux préparer le reste en attendant.

**Ce que ça implique (version simple) :**
- Tu déclares ton chiffre d'affaires chaque mois ou trimestre sur autoentrepreneur.urssaf.fr et tu paies ~22 % de cotisations sociales **uniquement sur ce que tu encaisses**. Zéro revenu = zéro charge.
- **Franchise de TVA** : en dessous de ~37 500 €/an de services, tu ne factures pas la TVA (mention "TVA non applicable, art. 293 B du CGI"). Tes 19 €/mois sont donc nets de TVA au début — simple.
- Un compte bancaire dédié n'est obligatoire qu'au-delà de 10 000 €/an de CA deux années de suite — mais ouvre-en un tôt (gratuit ou presque : compte en ligne), ça simplifie tout.

---

## Étape 2 — Les outils (budget total : 10-30 €)

| Outil | Usage | Prix |
|---|---|---|
| **Nom de domaine** (ex. facturx-connect.fr) | Site + email | ~10 €/an — **le seul achat obligatoire** |
| **Vercel** | Héberger l'app Next.js | Gratuit |
| **Neon** ou **Supabase** | Base Postgres (quand on remplacera le stockage JSON) | Gratuit |
| **Stripe** | Encaisser les abonnements | Gratuit (commission ~1,5-2,9 % par paiement) |
| **Zoho Mail** ou alias sur ton domaine | Email pro (contact@…) | Gratuit |

Pas de Mac nécessaire. Tout se pilote depuis un navigateur — ton téléphone suffit pour 80 % de ces étapes.

---

## Étape 3 — Mettre le produit en ligne (1 session)

1. Crée un compte **Vercel** (connexion avec GitHub).
2. "Import project" → ce dépôt → *Root Directory* : `facturx/`.
3. Ajoute la variable d'environnement `FACTURX_API_KEY` (une longue chaîne aléatoire).
4. Vercel te donne une URL en https. Branche ton domaine dessus (Settings → Domains).

⚠️ Le MVP stocke en JSON local — sur Vercel, il faudra brancher Postgres avant les vrais clients (c'est la première tâche technique de la liste, je peux la faire). Pour montrer le produit et récolter des emails, l'état actuel suffit.

---

## Étape 4 — Le site qui vend (avant même le produit parfait)

Ta page d'accueil doit dire, dans cet ordre :
1. **La peur** : "Au 1er septembre 2026, la facturation électronique devient obligatoire. WooCommerce n'est pas conforme en standard."
2. **La solution** : "Installez FacturX Connect : vos factures Factur-X se génèrent automatiquement à chaque commande. Conforme en 5 minutes."
3. **Le prix** : gratuit jusqu'à 10 factures/mois, 19 €/mois ensuite.
4. **Un bouton** : "Recevoir le plugin" → capture d'email (même avant la sortie officielle : une liste d'emails de marchands inquiets, c'est déjà un actif).

Les 3 premiers articles SEO sont prêts dans `content/blog/` — publie-les tels quels, un par semaine.

**La règle SEO du débutant :** un article = une question que les gens tapent réellement dans Google. Réponds complètement, honnêtement, sans blabla. Google récompense ça. Les recherches "facture électronique woocommerce" vont exploser à l'approche de septembre 2026 — chaque article publié maintenant prend position avant la vague.

---

## Étape 5 — Le plugin gratuit sur WordPress.org (le canal n°1)

Le répertoire officiel des extensions WordPress, c'est des millions d'installations potentielles, gratuitement :

1. Compte sur **wordpress.org** → "Add your plugin".
2. Tu soumets le plugin (le connecteur de `facturx/wp-plugin/`, enrichi d'un readme.txt et de la version gratuite autonome).
3. Une équipe bénévole le relit (**par email**, encore une fois) — compte 2-6 semaines.
4. Une fois accepté : chaque recherche "facture électronique" dans l'admin WordPress de n'importe quelle boutique française peut afficher TON plugin.

Stratégie freemium : le plugin gratuit génère 10 factures Factur-X/mois. Au-delà, ou pour l'envoi automatique au client et l'archivage : abonnement. Le gratuit est ton commercial silencieux.

---

## Étape 6 — Encaisser sans coder un système de facturation

Pas besoin de développer un billing compliqué pour les premiers clients :

1. Compte **Stripe** (inscription en ligne, il te faudra ton SIREN).
2. Crée un **Payment Link** : "FacturX Connect Standard — 19 €/mois, abonnement". Stripe génère une URL.
3. Mets cette URL derrière le bouton "Passer au plan Standard".
4. Quand quelqu'un paie, tu reçois un email → tu actives son compte à la main (tu lui envoies sa clé API par email). À 5 clients/semaine, ça prend 10 minutes. On automatisera quand ce sera douloureux — c'est un bon problème à avoir.

L'argent arrive sur ton compte bancaire tous les 2-7 jours, automatiquement, chaque mois.

---

## Étape 7 — Les 10 premiers clients (sans appel, sans pub payante)

Le SEO met 2-4 mois à décoller. En attendant, va là où les marchands posent déjà leurs questions **par écrit** :

- **Groupes Facebook** : "WooCommerce France", "WordPress France", groupes e-commerce FR (des dizaines de milliers de membres). Ne spamme pas : réponds utilement aux questions sur la facturation électronique, ta signature fait le reste.
- **Forums** : wpfr.net (la communauté WordPress francophone), forums PrestaShop.
- **Emails aux agences web** : 20 agences WooCommerce françaises, un email court : "vos clients devront être conformes en 2026-2027, voici un plugin qui le fait, ça vous intéresse pour votre parc ?". Un email, pas un appel. Une agence = potentiellement 30 boutiques d'un coup.
- **Ta liste d'emails** (étape 4) : chaque inscrit reçoit tes articles. Le jour du lancement payant, c'est ton premier vivier.

**L'objectif réaliste : 1 à 3 clients payants le premier mois après lancement, 10-30 à trois mois, puis la courbe SEO prend le relais et accélère jusqu'à la deadline de septembre 2026.**

---

## Planning : de zéro au premier euro

| Semaines | Actions |
|---|---|
| **1-2** | Micro-entreprise (INPI) · domaine · déployer sur Vercel · publier le site + article 1 · créer les comptes Stripe/email |
| **3-4** | Articles 2 et 3 · capture d'emails active · soumettre le plugin à WordPress.org · brancher Postgres (je m'en charge) |
| **5-8** | 1 article/semaine · présence dans les groupes/forums · emails aux agences · finir le billing Payment Link |
| **9-12** | Lancement payant auprès de la liste email · **premiers abonnements** 🎯 · itérer selon les retours |

## Les 4 pièges du débutant

1. **Perfectionner le produit avant d'avoir des lecteurs.** Le contenu d'abord : sans trafic, personne ne verra le produit parfait.
2. **Acheter des outils.** Tout ce qu'il faut est gratuit sauf le domaine. Le MacBook attendra les premiers 1 000 €.
3. **Sous-estimer la régularité.** 1 article/semaine pendant 6 mois bat 10 articles en janvier puis plus rien.
4. **Attendre d'être "prêt" pour encaisser.** Le Payment Link Stripe se crée en 10 minutes. Mets un prix dès le premier jour.

## FAQ express

- **Et si je vends zéro ?** Tu auras dépensé ~10 € et appris le SEO, Stripe et WordPress. Le risque financier est quasi nul — c'est tout l'intérêt de ce modèle.
- **Je dois facturer la TVA ?** Non, pas en dessous de ~37 500 €/an (franchise en base). Au-delà : bon problème, prends un comptable en ligne (~30 €/mois).
- **Il me faut des CGV/mentions légales ?** Oui avant d'encaisser — des générateurs gratuits existent, et je peux te les rédiger.
- **Un concurrent fait pareil ?** Le marché 2026-2027 est assez gros pour plusieurs acteurs. Celui qui publie le plus de bon contenu gagne la visibilité.
