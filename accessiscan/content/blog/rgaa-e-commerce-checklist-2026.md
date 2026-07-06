---
slug: rgaa-e-commerce-checklist-2026
title: "RGAA pour l'e-commerce : la checklist 2026 des 12 non-conformités qui coûtent des ventes (et des amendes)"
description: "Les 12 défauts d'accessibilité les plus fréquents sur les boutiques en ligne, leur impact sur vos ventes, et comment les détecter automatiquement — checklist RGAA orientée e-commerce."
date: "2026-07-04"
---

L'accessibilité d'une boutique en ligne n'est pas qu'une affaire de conformité : **12 millions de personnes en France vivent avec un handicap**, et un site inutilisable au clavier ou au lecteur d'écran, c'est un panier abandonné à coup sûr. Voici les 12 non-conformités que nous détectons le plus souvent sur les boutiques françaises, classées par impact.

## Les critiques — elles bloquent l'achat

**1. Images produit sans alternative textuelle (RGAA 1.1).** Sans attribut `alt`, un client au lecteur d'écran ignore ce que vous vendez. Sur une fiche produit, c'est la vente qui saute. Les visuels décoratifs, eux, doivent porter un `alt` vide pour ne pas polluer la lecture.

**2. Boutons « Ajouter au panier » muets (RGAA 11.9).** Un bouton-icône (panier, cœur, loupe) sans texte ni `aria-label` est invisible pour les technologies d'assistance. Testez : votre bouton d'achat a-t-il un nom ?

**3. Champs de formulaire sans étiquette (RGAA 11.1).** Adresse de livraison, code promo, email… un champ sans `<label>` associé rend le tunnel de commande infranchissable. C'est aussi l'un des constats les plus faciles pour un contrôleur.

**4. Liens vides ou « cliquez ici » (RGAA 6.1, 6.2).** Les liens-images sans intitulé et les « en savoir plus » en série rendent la navigation par liens (usage standard des lecteurs d'écran) inutilisable.

**5. Zoom bloqué sur mobile (RGAA 10.4).** `user-scalable=no` dans votre meta viewport interdit aux clients malvoyants d'agrandir le texte. La moitié du trafic e-commerce est mobile : c'est un mur à l'entrée.

**6. Cadres sans titre (RGAA 2.1).** Les iframes de paiement, de carte ou d'avis clients sans attribut `title` sont annoncés « cadre » tout court — angoissant au moment de payer.

## Les structurelles — elles dégradent tout le parcours

**7. Pas de langue déclarée (RGAA 8.3).** Sans `lang="fr"` sur la balise `<html>`, les lecteurs d'écran lisent votre français avec une prononciation anglaise.

**8. Titres de page identiques (RGAA 8.5).** Si toutes vos pages s'appellent « Accueil — Ma boutique », impossible de s'orienter entre onglets.

**9. Hiérarchie de titres anarchique (RGAA 9.1).** Les `h1`/`h2`/`h3` sont le plan du document : les sauts de niveaux et les pages sans `h1` cassent la navigation rapide.

**10. Identifiants dupliqués (RGAA 8.2).** Deux `id` identiques cassent les associations label/champ — fréquent quand un thème duplique le formulaire de recherche.

**11. Ordre de tabulation forcé (RGAA 12.8).** Les `tabindex` positifs créent des parcours clavier imprévisibles dans les tunnels de commande.

**12. Carrousels et vidéos en lecture automatique (RGAA 4.10).** Un média qui démarre seul et ne peut pas être arrêté perturbe la synthèse vocale et distrait fortement certains utilisateurs.

## Ce qu'un scan automatique ne verra jamais

Soyons honnêtes — c'est notre métier de l'être : les contrastes de couleurs calculés sur le rendu réel, la pertinence des textes alternatifs, les sous-titres des vidéos et la navigation clavier de bout en bout exigent un **audit humain**. Un scan automatique couvre environ un tiers des critères RGAA. Mais ces 12 points représentent l'essentiel des constats immédiats d'un contrôle — et des blocages réels de vos clients.

## Testez votre boutique maintenant

Notre [scanner gratuit](/#scanner) détecte les points 1 à 12 sur votre page d'accueil en 30 secondes, avec les extraits de code fautifs à transmettre à votre développeur ou votre agence. L'[offre Pro](/#tarifs) étend l'analyse à toutes vos pages — fiches produit, tunnel de commande — et génère votre [déclaration d'accessibilité obligatoire](/declaration).

> **La règle des 80/20 de l'accessibilité e-commerce** : corriger les images, les formulaires, les boutons et les liens de votre tunnel d'achat élimine la majorité des blocages réels — et des constats d'un contrôleur. Commencez là.
