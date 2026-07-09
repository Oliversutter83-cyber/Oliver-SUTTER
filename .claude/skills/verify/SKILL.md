---
name: verify
description: Build, launch and drive the Artisan Devis app (root Next.js project) to verify changes end-to-end.
---

# Vérifier Artisan Devis (projet racine)

## Build & lancement

```bash
npm install          # à la racine
npm run build        # next build (typecheck inclus, facturx/ est exclu du tsconfig racine)
npm start            # sert sur http://localhost:3000
```

Le sous-projet `facturx/` est une app Next.js séparée avec son propre
`package.json`/`tsconfig.json` — installer et builder dedans si c'est
elle qui est modifiée.

## Piloter l'UI

Chromium est préinstallé : Playwright avec
`executablePath: "/opt/pw-browsers/chromium"` (installer `playwright`
dans le scratchpad, pas dans le repo).

- `/api/generate` appelle l'API Anthropic et nécessite `ANTHROPIC_API_KEY`.
  Sans clé, mocker la route avec `page.route("**/api/generate", ...)` et
  renvoyer un brouillon `{ titre, client, lignes, tauxTVA, notes }`.
- `/api/devis` (save) fonctionne sans clé : stockage JSON dans `data/`
  (gitignoré, pas de nettoyage nécessaire).
- Flux principal : `/devis/nouveau` → remplir le textarea → « Générer le
  devis » → éditer les lignes → « Enregistrer le devis » → redirection
  vers `/devis/[id]`.
