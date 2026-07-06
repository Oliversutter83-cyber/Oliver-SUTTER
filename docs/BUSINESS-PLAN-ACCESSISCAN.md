# AccessiScan — Document de cadrage

*Version 1.0 — juillet 2026 · Produit prioritaire (FacturX Connect et Artisan Devis passent en réserve)*

## 1. Vision

**Être le réflexe des sites français face à l'obligation d'accessibilité : scanner, corriger, se couvrir — sans jamais parler à un commercial.** Un scan gratuit fait peur à juste titre, la déclaration légale gratuite capture l'email, l'abonnement Pro couvre juridiquement, tout se vend tout seul.

## 2. Le déclencheur : une loi déjà en vigueur (pas une échéance qui peut glisser)

- **28 juin 2025** : la directive européenne 2019/882 (European Accessibility Act) s'applique au secteur privé — e-commerce, banque en ligne, réservation, billetterie, livres numériques.
- **Concernés** : toute entreprise de plus de 10 salariés ou 2 M€ de CA vendant ces services à des consommateurs.
- **Référentiel** : EN 301 549 / RGAA 4.1.2 pour le web.
- **Sanctions** : jusqu'à **50 000 € par service** en France (DGCCRF), 500 000 € en Allemagne, 300 000 € en Espagne — cumulables. Contrôles montés en puissance début 2026.
- **Réalité du terrain** : la quasi-totalité des sites privés français n'a ni conformité ni déclaration d'accessibilité publiée (pourtant obligatoire et vérifiable en 10 secondes).

Avantage décisif sur FacturX : **aucune dépendance à une infrastructure d'État** (pas de PDP, pas d'immatriculation, pas d'agrément). La loi est en application, le référentiel est public, le produit est 100 % autonome.

## 3. Pourquoi ce business est « sans appels »

| Étape du client | Canal | Contact humain |
|---|---|---|
| Découverte | Google (« amende accessibilité site web »), répertoire WordPress.org | Aucun |
| Prise de conscience | Scan gratuit → score de risque immédiat | Aucun |
| Capture | Générateur de déclaration gratuit (email requis pour copier) | Aucun |
| Achat | Checkout carte (Stripe) | Aucun |
| Support | Email / base de connaissances | Email uniquement |

## 4. Cible

- **Cœur** : e-commerçants français (WooCommerce d'abord — des centaines de milliers de boutiques, déjà notre terrain de jeu avec FacturX) dépassant les seuils EAA, et tous ceux en dessous qui veulent éviter le risque et les ventes perdues.
- **Levier n°1 : les agences web.** Une agence gère 10 à 100 sites clients ; elle doit une réponse à ses clients sur l'accessibilité et n'a ni auditeur RGAA ni envie d'en recruter. L'offre Agence (marque blanche) transforme chaque agence en canal de distribution : elle revend l'audit 10× son coût.
- **Extension** : PrestaShop, Shopify (app store), puis les autres pays de l'UE — la directive est la même dans 27 pays, seul le référentiel local change à la marge.

## 5. Produit

### MVP (ce dépôt — `accessiscan/`)
- **Site + scanner en ligne** : URL → score /100, non-conformités RGAA avec extraits de code et corrections, niveau de risque juridique
- **Générateur de déclaration d'accessibilité** conforme au modèle officiel — gratuit contre email (l'aimant à leads)
- **Plugin WordPress gratuit** (répertoire WordPress.org = acquisition permanente) : audit en un clic depuis wp-admin + déclaration pré-remplie + lien Pro
- 3 articles SEO « de panique » + capture d'emails

### V1 (4-6 semaines) — déclenche les premiers abonnements
- Comptes clients + **Stripe billing** (29 €/site/mois, 149 €/mois agences)
- **Crawl multi-pages** (plan du site, fiches produit, tunnel de commande)
- **Rapport PDF** horodaté « à présenter en cas de contrôle » (la pièce que le client paie vraiment)
- **Surveillance mensuelle** : re-scan automatique + email d'alerte si régression

### V2
- Tableau de bord agences multi-sites, rapports en marque blanche
- Vérification des contrastes via rendu headless (Playwright) — on dépasse les scanners statiques
- Suivi de correction : chaque constat devient une tâche cochable (la preuve de démarche engagée, argument juridique)

### V3
- App Shopify (marchés UE), version anglaise/allemande (BFSG : amendes 500 k€)
- API publique pour les agences et les CMS

## 6. Modèle économique

- **Gratuit** : scan page d'accueil + déclaration générée (capture email) + plugin WordPress.
- **Pro 29 €/mois par site** : audit complet, plan d'action, déclaration maintenue, surveillance, PDF.
- **Agence 149 €/mois** : 20 sites, marque blanche, tableau de bord.

| Clients payants | MRR | ARR |
|---|---|---|
| 100 Pro + 10 agences | ~4,4 k€ | ~53 k€ |
| 400 Pro + 40 agences | ~17,6 k€ | ~210 k€ |
| 1 500 Pro + 150 agences | ~66 k€ | ~790 k€ |

Marge ~90 % (le scan est peu coûteux en calcul). Chaque agence cliente amène mécaniquement ses nouveaux sites. À l'échelle européenne (V3), le plafond dépasse largement le M€ d'ARR.

## 7. Distribution (zéro appel)

1. **Répertoire WordPress.org** : le plugin gratuit est trouvé par les recherches « accessibilité », « RGAA » — acquisition permanente, gratuite, dans le back-office même des clients.
2. **SEO de panique** : « amende accessibilité site web », « déclaration d'accessibilité obligatoire », « RGAA e-commerce » — les requêtes explosent à chaque vague de contrôles et d'articles de presse.
3. **Le générateur de déclaration gratuit** : lien le plus partageable du site (les experts-comptables, avocats et agences le recommandent parce qu'il est gratuit et sérieux).
4. **Emails aux agences** (autorisé par le cadre « pas d'appels ») : prospection B2B ciblée — « vos clients e-commerce sont exposés à 50 k€ d'amende, voici le rapport gratuit de 3 de leurs sites ». Le scan pré-fait est l'accroche parfaite : on envoie de la valeur, pas une plaquette.

## 8. Concurrence

- **Overlays américains (accessiBe, UserWay…)** : massivement critiqués, ne rendent pas conforme au RGAA (ils ne touchent pas au code source), poursuites aux USA malgré le widget. Notre positionnement anti-overlay est un argument de vente, pas un obstacle.
- **Cabinets d'audit RGAA** : 5 000-15 000 € la mission, délais en semaines — un autre marché. Nous sommes leur produit d'appel automatisé, pas leur concurrent frontal (partenariats possibles : on leur envoie les clients « totalement conforme » à certifier).
- **Petits SaaS français émergents** (générateurs de déclaration, scanners) : marché en formation, personne n'a ni la distribution WordPress.org ni l'angle e-commerce. La fenêtre est ouverte.

## 9. Risques et parades

| Risque | Parade |
|---|---|
| Contrôles DGCCRF moins fréquents qu'annoncé | Le marché « éviter les ventes perdues + image » demeure ; pivot messaging sans pivot produit |
| Un gros acteur (Cegid, PageSpeed-like) entre sur le créneau | Vitesse : être n°1 sur WordPress.org et le SEO français avant eux |
| Le scan statique jugé insuffisant | V2 rendu headless (contrastes) — barrière technique que les générateurs de déclaration n'ont pas |
| Nom/marque | Vérifier disponibilité INPI + domaine avant tout achat ; le code est agnostique au nom |
