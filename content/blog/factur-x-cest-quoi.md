---
title: "Factur-X, c'est quoi concrètement ? Le format expliqué sans jargon (avec exemple)"
slug: factur-x-cest-quoi
description: "Factur-X = un PDF normal + des données XML cachées dedans. Explication simple du format de facture électronique franco-allemand, et pourquoi c'est le bon choix pour l'e-commerce."
keywords: factur-x définition, format factur-x, facture électronique format, EN 16931, facture hybride
date: 2026-07-05
---

# Factur-X, c'est quoi concrètement ?

Si vous vous renseignez sur la facturation électronique, le mot **Factur-X** revient partout. Voici l'explication la plus simple possible — avec ce que ça change pour votre boutique.

## La définition en une phrase

**Factur-X = une facture PDF normale, avec un fichier de données XML caché à l'intérieur.**

C'est ce qu'on appelle une facture "hybride" ou "mixte" :

- **Pour un humain** : ça s'ouvre comme n'importe quel PDF. Votre client voit une facture classique — logo, lignes, totaux.
- **Pour un logiciel** : à l'intérieur du PDF se trouve un fichier `factur-x.xml` contenant toutes les données de la facture (vendeur, SIREN, TVA, lignes, montants) dans un format normalisé que les logiciels comptables et l'administration fiscale lisent automatiquement.

Fini la ressaisie manuelle des factures : le comptable de votre client importe le fichier, tout est déjà structuré.

## D'où ça sort ?

Factur-X est un standard **franco-allemand** (côté allemand, il s'appelle ZUGFeRD). Il applique la norme européenne **EN 16931**, qui définit les informations obligatoires d'une facture électronique. C'est l'un des trois formats acceptés par la réforme française 2026-2027, avec UBL et CII — et c'est le plus adapté au e-commerce, car il reste lisible par vos clients sans aucun outil spécial.

## Les "profils" Factur-X (MINIMUM, BASIC, EN 16931…)

Le standard prévoit plusieurs niveaux de détail des données XML :

| Profil | Contenu | Usage |
|---|---|---|
| MINIMUM | Totaux et identifiants seulement | Insuffisant pour la réforme dans la plupart des cas |
| **BASIC** | Lignes de facture, ventilation TVA | **Le bon niveau pour l'e-commerce** |
| EN 16931 | Toutes les données de la norme | Échanges B2B exigeants |
| EXTENDED | Données étendues | Grands comptes, cas complexes |

[FacturX Connect](/) génère du profil **BASIC** : chaque produit de la commande devient une ligne structurée avec sa TVA, exactement ce qu'attendent les plateformes et les logiciels comptables.

## À quoi ressemble le XML caché ? (extrait réel)

```xml
<rsm:ExchangedDocument>
  <ram:ID>FA-2026-0001</ram:ID>          <!-- numéro de facture -->
  <ram:TypeCode>380</ram:TypeCode>       <!-- 380 = facture commerciale -->
  <ram:IssueDateTime>
    <udt:DateTimeString format="102">20260705</udt:DateTimeString>
  </ram:IssueDateTime>
</rsm:ExchangedDocument>
```

Chaque information a sa place normalisée : le numéro, la date, le SIREN du vendeur, chaque ligne, chaque taux de TVA. C'est cette structure qui rend la facture "électronique" au sens de la loi — pas le fait qu'elle soit en PDF.

## Est-ce qu'un PDF classique peut être "converti" ?

Non — et c'est le piège. Scanner ou exporter une facture en PDF ne crée pas les données structurées. Il faut que la facture soit **générée nativement** avec son XML, par un outil qui connaît la norme. C'est pour ça que WooCommerce, PrestaShop et la plupart des extensions de facturation PDF actuelles ne suffisent pas.

## Comment générer du Factur-X sur ma boutique ?

Si vous êtes sur WooCommerce : installez [FacturX Connect](/), renseignez votre SIREN et votre TVA, et chaque commande génère automatiquement sa facture Factur-X — le PDF pour votre client, le XML pour la conformité, l'archivage pour vous. Gratuit jusqu'à 10 factures par mois.

---

*Dernière mise à jour : juillet 2026.*
