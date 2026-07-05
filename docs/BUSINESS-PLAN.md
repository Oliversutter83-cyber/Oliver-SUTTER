# Artisan Devis — Document de cadrage

*Version 1.0 — juillet 2026*

## 1. Vision

**Le back-office IA des artisans du bâtiment français.** L'artisan dicte son chantier depuis sa camionnette ; l'application produit un devis professionnel en 2 minutes, puis gérera la facturation électronique conforme et les relances d'impayés. L'objectif : que l'artisan ne rouvre plus jamais son ordinateur le soir pour faire de la paperasse.

## 2. Le problème

- Les devis se font le soir, sur un PC, avec Word/Excel ou un logiciel de bureau vieillissant. C'est la tâche la plus détestée du métier.
- Un devis envoyé en 2 heures au lieu de 3 jours multiplie le taux de signature — la réactivité est le premier facteur de conversion.
- Les impayés et relances sont la deuxième douleur : aucun outil simple ne les automatise pour une TPE de 1 à 5 personnes.
- **À partir de septembre 2026** (réception) puis **2027** (émission pour TPE/PME), la facturation électronique devient obligatoire en France : des millions d'artisans devront adopter un outil, qu'ils le veuillent ou non.

## 3. Pourquoi maintenant

1. **Tailwind réglementaire daté** : la réforme de la facturation électronique force l'équipement des TPE en 2026-2027. Acquisition quasi gratuite : ils viennent parce que la loi l'exige, ils restent pour l'IA.
2. **Le SaaS vertical surperforme** : ~18-22 % de croissance annuelle, rétention 35-60 % supérieure à l'horizontal, car l'outil devient critique au métier.
3. **L'IA rend le vocal enfin utilisable** : dictée → devis structuré fiable, ce qui était impossible il y a 3 ans.
4. **Moat de données** : chaque devis signé enrichit une base de prix réels par région et corps de métier. À 2 ans, l'IA chiffre mieux que tout entrant.

## 4. Cible

| Persona | Description | Douleur n°1 |
|---|---|---|
| **Artisan solo** (cœur de cible) | Plombier, électricien, couvreur, 0-2 salariés | Devis le soir, impayés |
| **Petite entreprise BTP** | 3-10 salariés, un(e) conjoint(e)/assistant(e) fait l'admin | Volume de devis, suivi |

Marché : ~1,4 M d'entreprises artisanales du bâtiment en France, très majoritairement des TPE.

## 5. Produit

### MVP (ce dépôt)
- Dictée vocale (ou saisie) → devis structuré généré par IA (lignes, prix HT réalistes, TVA 10/20 %)
- Gestion des statuts : brouillon → envoyé → signé/refusé
- Impression / PDF navigateur

### V1 (3-6 mois)
- Comptes multi-artisans, logo et mentions légales personnalisées
- Envoi par SMS/email + signature électronique du client
- Édition fine des lignes, bibliothèque de prestations réutilisables

### V2 (6-12 mois) — le déclencheur réglementaire
- Devis signé → **facture Factur-X** transmise via une Plateforme de Dématérialisation Partenaire (PDP)
- Relances automatiques des impayés
- Paiement en ligne (commission)

### V3+
- Base de prix communautaire par région/métier (le moat)
- Financement de chantier, assurance décennale — services financiers embarqués

## 6. Modèle économique

- **Abonnement** : 29 €/mois (solo) · 49 €/mois (équipe), sans engagement, 30 jours d'essai.
- **Take rate** sur paiement en ligne (V2) : ~1 %.
- Un outil qui fait signer 2 devis de plus par mois se rembourse ~50×. Le prix n'est pas l'objection ; l'objection est l'habitude.

**Hypothèses de traction** : 1 000 clients payants = ~420 k€ ARR ; 10 000 clients = ~4,2 M€ ARR. La vague réglementaire 2026-2027 est la fenêtre d'acquisition.

## 7. Distribution

1. **Prescripteurs** : comptables spécialisés artisans (la réforme les submerge — leur donner un outil à recommander), négoces de matériaux (Point P, Cedeo).
2. **Contenu** : TikTok/YouTube "vie d'artisan" — audience énorme, quasi aucun SaaS ne s'y adresse. Démos de 30 s : "je dicte, ça fait le devis".
3. **Bouche-à-oreille chantier** : parrainage (1 mois offert par filleul) — les artisans se côtoient entre corps de métier sur chaque chantier.

## 8. Concurrence

| Acteur | Positionnement | Notre angle |
|---|---|---|
| Obat, Tolteck | Devis/factures BTP, desktop-first | Mobile-first + IA vocale, zéro saisie |
| Axonaut, Pennylane | Gestion généraliste TPE | Vertical métier : prix du bâtiment, vocabulaire chantier |
| Excel/Word | 60 %+ du marché réel | C'est le vrai concurrent — l'IA vocale est le différenciateur qui justifie le changement |

Aucun acteur n'a gagné le marché ; la réforme rebat les cartes pour tous.

## 9. Risques

- **Exécution commerciale** : les artisans sont chers à atteindre en digital classique → miser sur prescripteurs + contenu + parrainage.
- **Réplication par les incumbents** : Obat/Tolteck ajouteront de l'IA → vitesse d'exécution et moat de données de prix.
- **Fiabilité IA sur les prix** : un devis mal chiffré coûte cher à l'artisan → prix toujours éditables, apprentissage sur les corrections, base de prix par région.
- **Dépendance à la dictée navigateur** : qualité variable → V1 : transcription serveur (Whisper ou équivalent) pour les cas difficiles.

## 10. KPIs à suivre dès le MVP

- Temps médian dictée → devis enregistré (cible : < 3 min)
- % de devis générés sans édition manuelle des prix (proxy de qualité IA)
- Taux de signature des devis envoyés
- Rétention M1/M3 des artisans actifs
