# AccessiScan — Plan de lancement détaillé, clic par clic

*Le compagnon du [guide 14 jours](GUIDE-PREMIERS-REVENUS-ACCESSISCAN.md) : chaque étape expliquée pour quelqu'un qui n'a jamais déployé un SaaS. Suivez dans l'ordre, cochez au fur et à mesure.*

---

## Étape 0 — Le statut d'entreprise (à lancer AUJOURD'HUI, car il y a un délai)

Pour encaisser via Stripe, il vous faut un numéro SIRET. Si vous n'en avez pas :

1. Allez sur **formalites.entreprises.gouv.fr** (guichet unique officiel, gratuit — méfiez-vous des sites qui facturent cette démarche).
2. « Créer une entreprise » → **Entrepreneur individuel (micro-entreprise)**.
3. Activité : « Édition de logiciels applicatifs » (code NAF 58.29C) ou « Programmation informatique » (62.01Z).
4. Comptez **1 à 2 semaines** pour recevoir le SIRET — c'est pour ça qu'on lance cette démarche en premier, tout le reste se fait en parallèle.
5. En micro-entreprise : ~22 % de cotisations sur le chiffre d'affaires encaissé, déclaration en ligne trimestrielle sur autoentrepreneur.urssaf.fr. Pas de TVA à facturer sous 39 100 €/an de services (mention « TVA non applicable, art. 293 B du CGI »).

> ✅ **Checkpoint** : dossier déposé, en attente du SIRET. On continue sans attendre.

### ⚠️ Cas particulier : fondateur mineur

Un mineur non émancipé ne peut pas exercer d'activité commerciale (vendre des abonnements en fait partie) ni ouvrir un compte Stripe (18 ans requis). **Rien de grave — trois voies :**

**Plan A (recommandé) : un parent porte la partie légale.**
- Le parent crée la micro-entreprise à son nom (étape 0 ci-dessus, 30 min, gratuit) et ouvre le compte Stripe rattaché.
- Le fondateur opère tout le reste : produit, site, prospection, support.
- Les revenus sont déclarés par le parent (micro-BIC/BNC trimestriel).
- À la majorité : création de la structure au nom du fondateur et bascule (nouveau Stripe, transfert du domaine — une journée de démarches).

*L'argumentaire pour les parents, en 4 points :*
1. Le produit existe déjà, il est construit et testé — il ne s'agit pas de financer une idée, juste de signer les papiers.
2. Coût réel : ~15 €/mois (hébergement + domaine). Pas d'emprunt, pas de stock, pas de local : le risque financier est celui d'un abonnement Netflix.
3. La micro-entreprise se crée ET se ferme en ligne en 30 minutes — engagement réversible à tout moment.
4. Le marché est porté par une obligation légale européenne (directive 2019/882) : la fenêtre 2026-2027 ne se représentera pas.

**Plan B : construire maintenant, encaisser plus tard.**
Tout ce qui n'exige aucun statut se lance immédiatement : domaine, site en ligne, scanner gratuit, capture d'emails, plugin WordPress.org, articles SEO, prospection « rapports gratuits » aux agences. La machine accumule leads, installations et référencement — l'actif le plus long à construire. Le paiement s'active en 1 h le jour où un Stripe existe (parent convaincu entre-temps, ou majorité). Adapter alors le site : bouton « S'abonner » → « Rejoindre la liste d'attente » (capture d'email) en attendant.

**Plan C : l'émancipation** (possible dès 16 ans, décision du juge des tutelles avec accord parental). Procédure longue et lourde — seulement si le plan A est impossible et que le plan B frustre.

*Dans tous les cas : ne jamais mentir sur l'identité du titulaire de l'entreprise dans les CGV/mentions légales, et rester sobre dans les emails de prospection (l'âge n'a pas à y figurer).*

---

## Étape 1 — Le nom et le domaine (~20 min, ~10 €/an)

1. **Vérifiez la marque** : sur **data.inpi.fr**, cherchez « accessiscan » (et vos variantes) dans « Marques ». S'il n'y a rien en classe 42 (logiciels), c'est bon. Pas besoin de déposer votre propre marque tout de suite (250 €) — ça attendra les premiers revenus.
2. **Vérifiez Google** : cherchez « accessiscan » — si un concurrent actif sort en premier, changez de nom (dites-le-moi, je renomme tout le code).
3. **Achetez le domaine** chez OVH (ovhcloud.com) ou Gandi (gandi.net) : `.fr` en priorité (votre cible est française, ~7-12 €/an). Prenez aussi le `.com` si disponible (~12 €/an) pour éviter qu'on vous le prenne.
4. Ne touchez à rien d'autre chez OVH/Gandi pour l'instant — on configurera les DNS aux étapes 2 et 3.

> ✅ **Checkpoint** : vous possédez `votredomaine.fr`.

---

## Étape 2 — Mettre le site en ligne sur Railway (~30 min, ~5 $/mois)

Railway héberge l'application avec un disque persistant (indispensable : vos clients et audits sont stockés dans des fichiers, ils doivent survivre aux redéploiements).

1. **Compte** : railway.app → « Login with GitHub » (autorisez l'accès à votre repo `oliver-sutter`).
2. **Projet** : « New Project » → « Deploy from GitHub repo » → choisissez votre repo.
3. **Répertoire racine** : dans le service créé → Settings → « Root Directory » → tapez `accessiscan`. Railway détecte Next.js et construit tout seul (`npm install`, `npm run build`, `npm start`).
4. **Le disque persistant (crucial)** : clic droit sur le service → « Attach Volume » → Mount path : `/app/data`. Sans ça, chaque mise à jour effacerait vos clients.
5. **Variables d'environnement** : onglet « Variables » du service, ajoutez pour l'instant :
   - `APP_URL` = `https://votredomaine.fr`
   - `CRON_SECRET` = une longue chaîne aléatoire (générez-la sur le champ : tapez n'importe quoi de 40 caractères, ou `openssl rand -hex 24` dans un terminal)
6. **Domaine** : Settings → « Networking » → « Custom Domain » → entrez `votredomaine.fr`. Railway affiche un enregistrement **CNAME** : copiez-le, puis chez OVH/Gandi → Zone DNS → ajoutez ce CNAME. Propagation : de 5 min à quelques heures.
7. **Vérifiez** : ouvrez `https://votredomaine.fr` → la page d'accueil s'affiche → testez le scanner sur un vrai site (le vôtre, celui d'un commerce local…).
8. **La surveillance mensuelle** : Railway → « New » → « Cron Job » dans le même projet, planification `0 6 1 * *`, commande :
   `curl -fsS "https://votredomaine.fr/api/cron/monitor?secret=VOTRE_CRON_SECRET"`
   (C'est le re-audit automatique de tous les sites clients le 1er de chaque mois.)

> ✅ **Checkpoint** : le site est en ligne sur votre domaine, le scanner fonctionne, le générateur de déclaration capture des emails. Vous pouvez déjà partager le lien.

---

## Étape 3 — L'adresse email professionnelle (~15 min, gratuit)

1. **zoho.com/mail** → offre « Forever Free » (5 boîtes, largement assez).
2. Ajoutez votre domaine, puis suivez leur assistant : il vous donne des enregistrements **MX**, **SPF** (TXT) et **DKIM** (TXT) à ajouter dans la zone DNS OVH/Gandi — copier-coller, rien de plus.
3. Créez `contact@votredomaine.fr`. Configurez la signature :
   > Prénom Nom — AccessiScan
   > Audit d'accessibilité RGAA & déclaration légale · votredomaine.fr
   > Testez votre site gratuitement : votredomaine.fr
4. Envoyez un email test vers votre adresse perso ET recevez-en un — vérifiez les deux sens.

> ✅ **Checkpoint** : `contact@votredomaine.fr` envoie et reçoit.

---

## Étape 4 — Stripe : encaisser par carte (~45 min)

1. **Compte** : stripe.com → inscrivez-vous avec `contact@votredomaine.fr`.
2. **Activation** : Stripe demande votre SIRET, une pièce d'identité et un IBAN (compte perso accepté en micro-entreprise au début, mais un compte dédié gratuit type Shine/Revolut est plus propre). Si le SIRET n'est pas encore arrivé, vous pouvez déjà tout construire en **mode test** et activer plus tard.
3. **Les 2 produits** : Catalogue de produits → « + Ajouter un produit » :
   - Nom : `AccessiScan Pro` — Tarif : **29,00 € / mois**, récurrent
   - Nom : `AccessiScan Agence` — Tarif : **149,00 € / mois**, récurrent
   Ouvrez chaque tarif et copiez son **ID de tarif** (commence par `price_...`).
4. **La clé API** : Développeurs → Clés API → copiez la **clé secrète** (`sk_test_...` en mode test, `sk_live_...` en live).
5. **Le webhook** : Développeurs → Webhooks → « + Ajouter un endpoint » :
   - URL : `https://votredomaine.fr/api/stripe/webhook`
   - Événements : cochez `checkout.session.completed` et `customer.subscription.deleted`
   - Copiez la **clé de signature** (`whsec_...`).
6. **Dans Railway → Variables**, ajoutez :
   - `STRIPE_SECRET_KEY` = `sk_test_...`
   - `STRIPE_PRICE_PRO` = `price_...` (celui à 29 €)
   - `STRIPE_PRICE_AGENCE` = `price_...` (celui à 149 €)
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...`
   Railway redéploie automatiquement.

> ✅ **Checkpoint** : le bouton « S'abonner » du site ouvre une vraie page de paiement Stripe.

---

## Étape 5 — Resend : les emails automatiques (~20 min, gratuit)

C'est ce qui envoie l'accès au client après paiement, les liens de connexion et les alertes mensuelles. Sans ça, un client paie et ne reçoit rien — étape obligatoire avant le premier euro réel.

1. **resend.com** → compte gratuit (100 emails/jour — très suffisant longtemps).
2. « Domains » → ajoutez `votredomaine.fr` → Resend affiche 2-3 enregistrements DNS (SPF/DKIM) → ajoutez-les chez OVH/Gandi → attendez le statut « Verified ».
3. « API Keys » → créez une clé → dans Railway → Variables :
   - `RESEND_API_KEY` = `re_...`
   - `EMAIL_FROM` = `AccessiScan <contact@votredomaine.fr>`

> ✅ **Checkpoint** : Resend affiche votre domaine « Verified ».

---

## Étape 6 — LE test qui valide tout (~15 min)

En mode test Stripe, déroulez le parcours d'un vrai client, sans tricher :

1. Navigation privée → `votredomaine.fr` → section Tarifs → « S'abonner — 29 €/mois »
2. Page Stripe : email = une adresse à vous, carte = `4242 4242 4242 4242`, date future, CVC quelconque
3. Après paiement → vous devez recevoir l'**email « Votre accès AccessiScan est prêt »** → cliquez → tableau de bord
4. Ajoutez un site réel → l'audit tourne (~30-60 s) → plan d'action affiché
5. Ouvrez le **rapport** → « Imprimer / Enregistrer en PDF » → vous obtenez le PDF horodaté
6. Déconnectez-vous → « Connexion » → entrez l'email → vous recevez le lien magique → vous re-rentrez

**Si les 6 points passent sans votre intervention, le business est opérationnel.** Basculez alors Stripe en mode live : refaites les étapes 4.4-4.6 avec les clés live (`sk_live_...`, nouveau webhook live, nouveaux `price_` live) et remplacez les variables dans Railway.

> ✅ **Checkpoint** : un inconnu peut payer et être servi pendant que vous dormez.

---

## Étape 7 — Le plugin WordPress : votre acquisition permanente (~30 min + délai de revue)

1. **Compte** : login.wordpress.org/register
2. **Zippez le plugin** : le dossier `accessiscan/wp-plugin/accessiscan/` → un fichier `accessiscan.zip` (le zip doit contenir le dossier `accessiscan/` avec les 2 fichiers dedans).
3. **Avant de soumettre**, remplacez dans `accessiscan.php` et `readme.txt` l'URL `https://accessiscan.fr` par votre vrai domaine si différent (demandez-moi, je le fais).
4. **Soumettez** : wordpress.org/plugins/developers/add → uploadez le zip. La revue humaine prend de 2 jours à 2 semaines. S'ils demandent des modifications (fréquent, bénin), transmettez-moi leur email tel quel : j'applique les corrections.
5. **Pendant l'attente**, préparez la fiche : 3-4 captures d'écran de l'écran d'audit (1200×900) et une bannière (1544×500). Ce sont elles qui font le taux d'installation.

> ✅ **Checkpoint** : plugin soumis, en file de revue.

---

## Étape 8 — Google Search Console (~10 min)

1. search.google.com/search-console → « Ajouter une propriété » → votre domaine → validation par enregistrement DNS (TXT chez OVH/Gandi).
2. « Sitemaps » → soumettez `https://votredomaine.fr/sitemap.xml`.
3. N'attendez rien avant 4-8 semaines — le SEO est un investissement qui compose. Vos 3 articles sont déjà optimisés sur les bonnes requêtes.

---

## Étape 9 — La prospection écrite : 5 agences par jour, tous les jours

C'est l'étape qui crée les clients. Les autres n'étaient que la plomberie.

### Construire la liste de 50 agences (1 h, une seule fois)

Sources, dans l'ordre d'efficacité :
- LinkedIn : recherchez « agence WordPress » / « agence e-commerce » / « agence WooCommerce », filtre France
- Google : « agence WooCommerce Lyon », « agence Shopify Bordeaux »… (les agences de région répondent mieux que les parisiennes sur-sollicitées)
- Annuaires : wpfr.net (prestataires), Sortlist, Clutch.co (filtre France)

Tenez un tableau (Google Sheets) : *Agence · Site · Email trouvé · Sites clients scannés · Scores · Envoyé le · Relancé le · Réponse*. L'email se trouve sur la page contact de l'agence ou via son formulaire.

### La routine quotidienne (45 min/jour, non négociable)

1. Prenez 5 agences de la liste.
2. Pour chacune : ouvrez son portfolio, prenez 2-3 sites e-commerce clients, passez-les dans **votre propre scanner** — notez les scores et les 2 pires constats.
3. Envoyez cet email (personnalisé avec les vrais chiffres — c'est ce qui fait tout) :

> **Objet : [Agence] — 3 sites de votre portfolio exposés (accessibilité EAA)**
>
> Bonjour,
>
> La directive européenne accessibilité s'applique aux e-commerces depuis juin 2025 (jusqu'à 50 000 € d'amende par service, contrôles DGCCRF en cours). Par curiosité professionnelle, j'ai passé trois sites de votre portfolio dans notre scanner RGAA :
>
> — [siteA.fr] : 34/100 — 12 images sans alternative, formulaire de commande sans étiquettes
> — [siteB.fr] : 51/100 — liens vides, zoom mobile bloqué
> — [siteC.fr] : 47/100 — pas de déclaration d'accessibilité publiée (constat immédiat en cas de contrôle)
>
> Les rapports détaillés sont là (gratuits, sans inscription) : [liens vers votredomaine.fr]
>
> Si vous voulez équiper l'agence — audits illimités sur 20 sites clients, rapports à votre marque, déclarations générées — c'est 149 €/mois sans engagement, tout en ligne : votredomaine.fr/#tarifs. Beaucoup d'agences le refacturent 3 à 10× à leurs clients en prestation « mise en conformité ».
>
> Tout se passe par email — pas de démo forcée, pas d'appel.
>
> [Prénom] — AccessiScan

4. **Relance J+3** (une seule, courte) : « Bonjour, avez-vous vu les rapports ? Je les garde en ligne jusqu'à vendredi. Trois corrections suffisent souvent à sécuriser le gros du risque — la liste est dans le rapport. »

### Réponses aux objections courantes (copiez-collez)

- **« Nos clients ont déjà un widget d'accessibilité »** → « Les overlays ne modifient pas le code source, or c'est le code qu'évalue le RGAA — et l'absence de déclaration d'accessibilité reste un constat immédiat. Le rapport joint le montre : le widget n'a corrigé aucun des constats listés. »
- **« Nos clients font moins de 10 salariés »** → « Le seuil s'apprécie aussi à 2 M€ de CA, et l'obligation de déclaration touche plus large. Et au-delà du droit : ces défauts bloquent de vrais acheteurs (12 M de personnes concernées en France). »
- **« Combien pour un audit ponctuel ? »** → « Nous ne vendons pas d'audit ponctuel : la conformité se dégrade à chaque mise à jour du site. 149 €/mois couvre 20 sites en continu, rapports mensuels horodatés compris — c'est le prix d'une heure d'agence. »
- **Pas de réponse après relance** → on passe à la suivante. C'est un jeu de volume : 50 envoyés → ~10 réponses → 2-4 clients.

---

## Le tableau de bord de vos 14 premiers jours

| Jour | Action | Fait |
|---|---|---|
| J1 | Micro-entreprise déposée + domaine acheté | ☐ |
| J1-J2 | Railway en ligne + email pro | ☐ |
| J2-J3 | Stripe + Resend + **test complet carte 4242** | ☐ |
| J3 | Bascule Stripe en live | ☐ |
| J4 | Plugin soumis à WordPress.org + Search Console | ☐ |
| J4 | Liste des 50 agences constituée | ☐ |
| J5-J14 | **5 emails d'agences par jour** + relances J+3 | ☐ |
| J14 | Bilan : 3 clients payants ? Sinon on ajuste le message, pas le produit | ☐ |

## Les 3 pièges qui tuent les lancements

1. **Retoucher le produit au lieu de prospecter.** Le produit est terminé et testé. Chaque heure de « petite amélioration » est une heure volée aux 5 emails du jour.
2. **Attendre que le SEO/plugin fasse le travail.** Ils composeront sur des mois. Les 14 premiers jours, seuls les emails d'agences créent des clients.
3. **Changer d'idée au premier silence.** 20 emails sans réponse, c'est normal et prévu. On évalue à 50 envois, pas à 10. Prochain pivot autorisé : le *message* ou la *cible* — jamais le produit avant 90 jours.
