# AccessiScan — Les 14 premiers jours : du dépôt au premier euro

*L'objectif n'est pas la perfection, c'est le premier paiement. Tout ce qui suit se fait par écrit (email, formulaires) — zéro appel.*

## Jour 1-2 : mettre le site en ligne

1. **Vérifier le nom.** Avant tout : disponibilité du domaine (`accessiscan.fr` ou variante) et recherche rapide INPI + Google. Si pris, renommer coûte 30 minutes maintenant, une semaine plus tard.
2. **Déployer sur Railway ou un VPS** (le dossier `accessiscan/` est un projet Next.js standard : `npm install && npm run build && npm start`). **Pas Vercel pour la production** : les comptes clients et audits sont stockés en fichiers JSON (`data/`), il faut un disque persistant — Railway le fournit en 2 clics. Brancher le domaine.
3. **Créer l'adresse `contact@`** (Zoho Mail gratuit ou équivalent) — c'est votre unique canal client, il doit être irréprochable.
4. Tester le parcours complet : scan d'un vrai site → résultats → générateur de déclaration → email capturé — puis le parcours d'achat en mode démo (sans clés Stripe, le bouton d'achat simule un paiement et ouvre le vrai tableau de bord).

## Jour 3-5 : brancher l'encaissement automatique (le produit est déjà self-serve)

5. **Stripe** (~30 min) : créer le compte, puis dans le Dashboard → Catalogue, 2 tarifs récurrents mensuels (29 € et 149 €). Renseigner `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_AGENCE` dans les variables d'environnement. Ajouter le webhook `{APP_URL}/api/stripe/webhook` (événements : `checkout.session.completed`, `customer.subscription.deleted`) et copier `STRIPE_WEBHOOK_SECRET`.
6. **Resend** (~15 min) : créer la clé API, vérifier le domaine d'envoi, renseigner `RESEND_API_KEY` et `EMAIL_FROM`. C'est ce qui envoie l'accès après paiement et les alertes de surveillance.
7. **Tester l'achat réel** en mode test Stripe (carte 4242…) : bouton tarif → paiement → email reçu → tableau de bord → audit du site → rapport PDF. Le parcours entier doit passer sans vous. Ensuite, basculer les clés en mode live.
8. Définir `CRON_SECRET` et vérifier la surveillance : `curl "{APP_URL}/api/cron/monitor?secret=..."` (le cron mensuel de `vercel.json` — ou une crontab — fera ça tout seul le 1er du mois).

## Jour 6-8 : soumettre le plugin WordPress

9. **Compte WordPress.org** + soumission du dossier `accessiscan/wp-plugin/accessiscan/` (zip). La revue prend de quelques jours à 2 semaines — c'est pour ça qu'on soumet dès la semaine 1.
10. Pendant la revue : captures d'écran + bannière pour la fiche du répertoire (c'est ce qui fait le taux d'installation).
11. Publier les 3 articles du blog (déjà rédigés dans `accessiscan/content/blog/`) et soumettre le sitemap à Google Search Console.

## Jour 9-14 : la prospection écrite qui rapporte

12. **La technique du rapport pré-fait (le cœur du plan).** Listez 50 agences web françaises (annuaire des agences WordPress, LinkedIn). Pour chacune : scannez 2-3 sites de *leurs clients e-commerce* visibles dans leur portfolio. Envoyez un email court :
    > *Objet : [Nom agence] — 3 de vos sites clients exposés (accessibilité EAA)*
    >
    > Bonjour, la directive accessibilité s'applique depuis juin 2025 (jusqu'à 50 k€ d'amende par service, contrôles DGCCRF en cours). J'ai passé 3 sites de votre portfolio au scanner RGAA : [site A : 34/100, 5 non-conformités critiques] […]. Rapports détaillés joints, gratuits. Si vous voulez équiper toute votre agence (rapports en marque blanche à revendre à vos clients), c'est 149 €/mois, paiement en ligne : [lien vers la page tarifs]. Tout se passe par email — pas de démo, pas d'appel.
    
    C'est de la valeur envoyée, pas du spam : le rapport est réel, utile, et met l'agence face à son risque commercial. Taux de réponse attendu bien au-dessus du cold email classique.
13. **Poster là où sont les cibles** (1 post utile, pas de la pub) : groupes Facebook/LinkedIn WordPress France & e-commerce, forum WPFR, r/webdev_fr. Format : « J'ai scanné 100 boutiques françaises : 96 % présentent des non-conformités RGAA critiques — voici les 5 plus fréquentes et comment les corriger ». Le scanner gratuit en signature.
14. **Relancer chaque lead du générateur de déclaration** (J+2 après capture) : « Votre déclaration est-elle publiée ? Prochaine étape : corriger les non-conformités critiques. Voici ce que donne l'audit complet sur un site comme le vôtre : [extrait]. 29 €/mois, résiliable en un clic : [lien vers la page tarifs]. »

## Les métriques qui comptent (et rien d'autre)

| Métrique | Objectif J+14 | Pourquoi |
|---|---|---|
| Scans réalisés | 200 | Le haut du tunnel fonctionne |
| Emails capturés (déclaration) | 40 | Le lead magnet convertit (~20 %) |
| Emails agences envoyés | 50 | La seule action 100 % sous votre contrôle |
| **Clients payants** | **3** | **Tout le reste est du décor** |

3 clients = 87-450 €/mois. Ce n'est pas 200 k€ — c'est la preuve que des inconnus paient, le signal pour investir dans la V2 (Postgres, marque blanche agences, vérification des contrastes). Sans cette preuve à J+14, on ajuste le message ou la cible, pas le produit.

## Ce qu'on ne fait PAS pendant ces 14 jours

- Pas de refonte du produit, pas de « une dernière fonctionnalité avant de lancer »
- Pas de réseaux sociaux généralistes, pas de logo à 500 €
- Pas de nouveau pivot d'idée — le prochain pivot autorisé est un pivot de *message* ou de *cible*, jamais de produit, avant 90 jours
- Pas d'appels. Tout par écrit, comme prévu.
