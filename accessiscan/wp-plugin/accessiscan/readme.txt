=== AccessiScan – Audit accessibilité RGAA & déclaration d'accessibilité ===
Contributors: accessiscan
Tags: accessibilite, rgaa, accessibility, audit, conformite
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Audit d'accessibilité RGAA en un clic : score de risque, non-conformités détectées avec extraits de code, et déclaration d'accessibilité pré-remplie.

== Description ==

Depuis le 28 juin 2025, la directive européenne accessibilité (European Accessibility Act) impose l'accessibilité numérique aux sites e-commerce et services en ligne des entreprises de plus de 10 salariés ou 2 M€ de chiffre d'affaires — avec des sanctions pouvant atteindre 50 000 € par service non conforme en France.

**AccessiScan vous dit où vous en êtes, en un clic, depuis votre tableau de bord WordPress.**

= Ce que fait l'extension (gratuit) =

* **Analyse RGAA automatisée** de votre page d'accueil : images sans alternative textuelle, liens vides, champs de formulaire sans étiquette, cadres sans titre, boutons muets, langue absente, hiérarchie de titres, zoom bloqué sur mobile…
* **Score de risque sur 100** avec la référence du critère RGAA 4.1.2 pour chaque constat
* **Extraits de code fautifs** à transmettre tels quels à votre développeur ou votre agence
* **Déclaration d'accessibilité pré-remplie** conforme au modèle légal (article 47 de la loi n° 2005-102), prête à publier — le document que les contrôleurs vérifient en premier

= Ce que l'extension ne prétend pas faire =

Un scan automatique couvre environ un tiers des critères RGAA. Contrairement aux « widgets d'accessibilité » qui promettent une conformité en un clic (et ne protègent juridiquement de rien), AccessiScan vous donne un diagnostic honnête et les corrections à faire dans votre code — la seule chose qui compte pour le RGAA.

= AccessiScan Pro =

Pour aller au bout de la mise en conformité : audit de toutes les pages du site, plan d'action priorisé, surveillance mensuelle avec alertes, rapport PDF à présenter en cas de contrôle. À partir de 29 €/mois sur [accessiscan.fr](https://accessiscan.fr).

== Installation ==

1. Installez l'extension depuis le répertoire officiel ou téléversez le dossier `accessiscan` dans `/wp-content/plugins/`.
2. Activez l'extension.
3. Ouvrez le menu « AccessiScan » dans votre tableau de bord et cliquez sur « Analyser mon site maintenant ».

== Frequently Asked Questions ==

= L'extension modifie-t-elle mon site ? =

Non. AccessiScan est un outil de diagnostic : il lit votre page d'accueil et produit un rapport. Il n'injecte rien sur votre site public.

= Le score 100/100 signifie-t-il que je suis conforme ? =

Non — il signifie qu'aucune non-conformité *détectable automatiquement* n'a été trouvée. La conformité RGAA complète exige des vérifications humaines (contrastes, navigation clavier, pertinence des textes). Méfiez-vous de tout outil qui prétend le contraire.

= Suis-je concerné par l'obligation légale ? =

Si vous vendez en ligne à des consommateurs et que votre entreprise dépasse 10 salariés ou 2 M€ de CA, oui, depuis le 28 juin 2025. En dessous de ces seuils, l'accessibilité reste un facteur de ventes : 12 millions de personnes en France vivent avec un handicap.

= Où sont envoyées mes données ? =

Nulle part. L'analyse s'exécute entièrement sur votre serveur WordPress. L'extension ne collecte ni ne transmet aucune donnée.

== Changelog ==

= 1.0.0 =
* Première version : audit RGAA automatisé de la page d'accueil, score de risque, déclaration d'accessibilité pré-remplie.
