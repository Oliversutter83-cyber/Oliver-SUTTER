# Monorepo SaaS

Trois produits vivent dans ce dépôt :

| Produit | Dossier | Statut |
|---|---|---|
| ♿ **AccessiScan** — audit accessibilité RGAA + déclaration légale (EAA) | [`accessiscan/`](accessiscan/) | **Prioritaire** — [cadrage](docs/BUSINESS-PLAN-ACCESSISCAN.md) · [plan 14 jours](docs/GUIDE-PREMIERS-REVENUS-ACCESSISCAN.md) |
| ⚡ **FacturX Connect** — facturation électronique WooCommerce (Factur-X) | [`facturx/`](facturx/) | En réserve — [cadrage](docs/BUSINESS-PLAN-FACTURX.md) |
| 🛠️ **Artisan Devis** — devis vocaux IA pour artisans | racine (ci-dessous) | En réserve — [cadrage](docs/BUSINESS-PLAN.md) |

---

# 🛠️ Artisan Devis

**Le back-office IA des artisans du bâtiment.** Dictez votre chantier, obtenez un devis professionnel en 2 minutes — pensé pour être utilisé sur mobile, entre deux chantiers.

> 📊 Le cadrage complet (marché, modèle économique, roadmap) est dans [`docs/BUSINESS-PLAN.md`](docs/BUSINESS-PLAN.md).

## Le produit (MVP)

1. **🎙️ Dictée vocale** — l'artisan décrit le chantier à la voix (Web Speech API, français) ou au clavier.
2. **✨ Génération IA** — l'API Claude transforme la dictée en devis structuré : lignes chiffrées, prix HT réalistes, TVA adaptée (10 % rénovation / 20 % neuf).
3. **📋 Gestion des devis** — liste, statuts (brouillon → envoyé → signé/refusé), impression / export PDF via le navigateur.

## Démarrage

```bash
npm install
cp .env.example .env      # ajoutez votre ANTHROPIC_API_KEY
npm run dev               # http://localhost:3000
```

**Sans clé API**, l'application fonctionne en **mode démo** : la génération renvoie un devis simulé, ce qui permet de tester toute l'UX.

> La dictée vocale nécessite un navigateur compatible Web Speech API (Chrome, Edge, Safari). La saisie clavier fonctionne partout.

## Stack

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | Full-stack simple, déploiement Vercel en 1 clic |
| IA | API Claude (`claude-opus-4-8`) + structured outputs (Zod) | Sortie JSON garantie conforme au schéma du devis |
| Voix | Web Speech API navigateur | Gratuit, sans backend, suffisant pour le MVP |
| Données | Fichier JSON local (`data/devis.json`) | Zéro dépendance pour le MVP — à remplacer par Postgres |

## Structure

```
app/
  page.tsx                  # Liste des devis
  devis/nouveau/page.tsx    # Dictée → génération → aperçu → enregistrement
  devis/[id]/page.tsx       # Détail, statuts, impression
  api/generate/route.ts     # Dictée → devis structuré (Claude)
  api/devis/...             # CRUD devis
lib/
  ai.ts                     # Client Claude + schéma Zod + mode démo
  store.ts                  # Persistance JSON (MVP)
  types.ts                  # Types métier partagés
docs/
  BUSINESS-PLAN.md          # Cadrage business complet
```

## Prochaines étapes (post-MVP)

- [ ] Authentification multi-artisans + Postgres
- [ ] Édition des lignes du devis avant enregistrement
- [ ] Envoi du devis par SMS/email avec signature électronique
- [ ] Conversion devis signé → facture **Factur-X** (réforme facturation électronique 2026-2027)
- [ ] Relances automatiques des impayés
- [ ] Base de prix apprise des devis signés (le moat data)
