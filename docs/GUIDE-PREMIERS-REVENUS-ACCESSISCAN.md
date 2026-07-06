# AccessiScan — Les 14 premiers jours : du dépôt au premier euro

*L'objectif n'est pas la perfection, c'est le premier paiement. Tout ce qui suit se fait par écrit (email, formulaires) — zéro appel.*

## Jour 1-2 : mettre le site en ligne

1. **Vérifier le nom.** Avant tout : disponibilité du domaine (`accessiscan.fr` ou variante) et recherche rapide INPI + Google. Si pris, renommer coûte 30 minutes maintenant, une semaine plus tard.
2. **Déployer sur Vercel** (le dossier `accessiscan/` est un projet Next.js standard) : import du repo → dossier racine `accessiscan` → déployer. Brancher le domaine.
3. **Créer l'adresse `contact@`** (Zoho Mail gratuit ou équivalent) — c'est votre unique canal client, il doit être irréprochable.
4. Tester le parcours complet : scan d'un vrai site → résultats → générateur de déclaration → email capturé dans `data/leads.json`.
   *Note technique : sur Vercel, le stockage fichier est éphémère — brancher rapidement les leads sur un Google Sheet via webhook, ou n'importe quel formulaire (Tally, Formspark) en attendant une base.*

## Jour 3-5 : encaisser — avant même d'avoir « fini » le produit

5. **Créer 2 Payment Links Stripe** : Pro 29 €/mois, Agence 149 €/mois. Remplacer les liens `mailto:` de la section tarifs par ces liens.
6. **Assumer le mode « early access »** : tant que le crawl multi-pages n'est pas codé, l'offre Pro est livrée *manuellement* — vous lancez le scanner sur les 10 pages principales du client, compilez le rapport PDF (export impression du navigateur), livrez sous 48 h par email. **10 clients servis à la main valent mieux que 0 client automatisé.** C'est aussi votre meilleure étude utilisateur.
7. Rédiger les 3 emails types (fichiers texte, réutilisables) : livraison de rapport, relance lead déclaration, réponse « êtes-vous concerné ? ».

## Jour 6-8 : soumettre le plugin WordPress

8. **Compte WordPress.org** + soumission du dossier `accessiscan/wp-plugin/accessiscan/` (zip). La revue prend de quelques jours à 2 semaines — c'est pour ça qu'on soumet dès la semaine 1.
9. Pendant la revue : captures d'écran + bannière pour la fiche du répertoire (c'est ce qui fait le taux d'installation).
10. Publier les 3 articles du blog (déjà rédigés dans `accessiscan/content/blog/`) et soumettre le sitemap à Google Search Console.

## Jour 9-14 : la prospection écrite qui rapporte

11. **La technique du rapport pré-fait (le cœur du plan).** Listez 50 agences web françaises (annuaire des agences WordPress, LinkedIn). Pour chacune : scannez 2-3 sites de *leurs clients e-commerce* visibles dans leur portfolio. Envoyez un email court :
    > *Objet : [Nom agence] — 3 de vos sites clients exposés (accessibilité EAA)*
    >
    > Bonjour, la directive accessibilité s'applique depuis juin 2025 (jusqu'à 50 k€ d'amende par service, contrôles DGCCRF en cours). J'ai passé 3 sites de votre portfolio au scanner RGAA : [site A : 34/100, 5 non-conformités critiques] […]. Rapports détaillés joints, gratuits. Si vous voulez équiper toute votre agence (rapports en marque blanche à revendre à vos clients), c'est 149 €/mois : [lien Stripe]. Tout se passe par email — pas de démo, pas d'appel.
    
    C'est de la valeur envoyée, pas du spam : le rapport est réel, utile, et met l'agence face à son risque commercial. Taux de réponse attendu bien au-dessus du cold email classique.
12. **Poster là où sont les cibles** (1 post utile, pas de la pub) : groupes Facebook/LinkedIn WordPress France & e-commerce, forum WPFR, r/webdev_fr. Format : « J'ai scanné 100 boutiques françaises : 96 % présentent des non-conformités RGAA critiques — voici les 5 plus fréquentes et comment les corriger ». Le scanner gratuit en signature.
13. **Relancer chaque lead du générateur de déclaration** (J+2 après capture) : « Votre déclaration est-elle publiée ? Prochaine étape : corriger les non-conformités critiques. Voici ce que donne l'audit complet sur un site comme le vôtre : [extrait]. 29 €/mois, résiliable en un clic : [lien Stripe]. »

## Les métriques qui comptent (et rien d'autre)

| Métrique | Objectif J+14 | Pourquoi |
|---|---|---|
| Scans réalisés | 200 | Le haut du tunnel fonctionne |
| Emails capturés (déclaration) | 40 | Le lead magnet convertit (~20 %) |
| Emails agences envoyés | 50 | La seule action 100 % sous votre contrôle |
| **Clients payants** | **3** | **Tout le reste est du décor** |

3 clients = 87-450 €/mois. Ce n'est pas 200 k€ — c'est la preuve que des inconnus paient, le signal pour investir dans la V1 (crawl multi-pages, PDF automatique, Stripe billing intégré). Sans cette preuve à J+14, on ajuste le message ou la cible, pas le produit.

## Ce qu'on ne fait PAS pendant ces 14 jours

- Pas de refonte du produit, pas de « une dernière fonctionnalité avant de lancer »
- Pas de réseaux sociaux généralistes, pas de logo à 500 €
- Pas de nouveau pivot d'idée — le prochain pivot autorisé est un pivot de *message* ou de *cible*, jamais de produit, avant 90 jours
- Pas d'appels. Tout par écrit, comme prévu.
