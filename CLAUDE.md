# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Two products, one repo

This is a monorepo hosting two independent Next.js apps, each with its own `package.json`, `tsconfig.json` and `node_modules`:

| Product | Location | Status |
|---|---|---|
| **FacturX Connect** — Factur-X e-invoicing for WooCommerce shops | `facturx/` | **Priority** — see `docs/BUSINESS-PLAN-FACTURX.md` |
| **Artisan Devis** — AI voice-dictated quotes for building tradespeople | repo root | On hold — see `docs/BUSINESS-PLAN.md` |

There is no workspace tooling — treat them as two separate apps. Install and run each from its own directory. Both default to port 3000, so use `next dev -p <port>` to run them side by side.

**Everything is in French**: UI copy, code comments, commit messages, docs, and domain vocabulary (devis = quote, facture = invoice, HT/TTC = excl./incl. VAT, TVA = VAT). Keep new code and commits in French.

## Commands

```bash
# Artisan Devis (repo root)
npm install
cp .env.example .env      # optional: add ANTHROPIC_API_KEY
npm run dev               # http://localhost:3000
npm run build
npm run lint              # next lint

# FacturX Connect
cd facturx
npm install
npm run dev               # http://localhost:3000 (no lint script here)
npm run build
```

There is no test suite in either app. `npm run build` (which type-checks under `strict: true`) is the main verification step.

Both apps run in **demo mode without any env vars** — this is a deliberate design point, preserve it when adding features:
- Root app: without `ANTHROPIC_API_KEY`, `lib/ai.ts` returns a mocked quote instead of calling Claude.
- FacturX: without `FACTURX_API_KEY`, `POST /api/orders` skips authentication; `SELLER_*` env vars (`SELLER_NAME`, `SELLER_ADDRESS`, `SELLER_SIREN`, `SELLER_VAT`) fall back to demo values in `facturx/lib/config.ts`. The dashboard's "Simuler une commande" button exercises the whole pipeline without a real shop.

## Architecture

Both apps follow the same MVP pattern: Next.js 15 App Router + React 19 + TypeScript strict, API route handlers under `app/api/`, and **JSON-file persistence on disk** (`data/`, gitignored) instead of a database. The stores (`lib/store.ts` in each app) read/rewrite the whole JSON file on every operation and are explicitly slated for replacement by Postgres before production — don't build anything that assumes concurrency safety.

### FacturX Connect (`facturx/`)

The value chain is: WooCommerce plugin → SaaS API → Factur-X invoice (PDF with embedded XML).

- `wp-plugin/facturx-connector.php` — minimal WordPress/WooCommerce connector (~100 lines, untested on a real WP install). On order completion it POSTs an `OrderPayload` JSON to the SaaS with an `x-api-key` header.
- `app/api/orders/route.ts` — entry point. Validates the payload, then runs the pipeline: `createInvoice` (store) → `buildFacturXXml` (`lib/cii.ts`) → `buildInvoicePdf` (`lib/pdf.ts`) → `saveInvoiceFiles` (PDF + XML written to `data/files/`).
- `lib/cii.ts` — **the core of the product**: hand-built UN/CEFACT CII XML, Factur-X 1.0 BASIC profile (EN 16931 structure). Not yet validated against the official FNFE-MPE XSD/Schematron.
- `lib/pdf.ts` — pdf-lib invoice PDF with the XML attached via `AFRelationship.Data`. Not yet PDF/A-3 certified (missing XMP metadata / color profiles).
- `lib/types.ts` — domain types plus all money math: `round2`, `lineTotalHT`, `invoiceTotalHT/TVA/TTC` and `vatBreakdown` (per-rate VAT ventilation, required by EN 16931). Totals are always computed from lines, never stored — route all amount calculations through these helpers.
- `app/api/invoices/[id]/[kind]/route.ts` serves the archived PDF/XML files; `app/dashboard/` lists invoices.
- Marketing site lives in the same app: landing page with email capture (`app/api/leads/route.ts` → `data/leads.json`) and a blog rendered from Markdown files in `content/blog/` with hand-parsed frontmatter (`lib/blog.ts`, no CMS). Blog posts need `title`, `description`, `date` (and optionally `slug`) frontmatter keys.

Known MVP gaps are listed in `facturx/README.md` — check them before claiming production readiness of anything touching PDF/XML conformance or the WP plugin.

### Artisan Devis (repo root)

Flow: voice dictation (browser Web Speech API, French) → Claude turns the transcript into a structured quote → JSON store → print/PDF via the browser.

- `lib/ai.ts` — Claude call using the SDK's structured outputs (`client.messages.parse` + `zodOutputFormat`) against `DevisGenereSchema` (Zod). The system prompt encodes French pricing/VAT business rules (10% VAT for renovation of 2+ year-old housing, 20% otherwise). Model: `claude-opus-4-8` with adaptive thinking.
- `app/api/generate/route.ts` — dictation → structured quote; `app/api/devis/` — CRUD.
- `lib/types.ts` — `Devis` domain types, status workflow `brouillon → envoye → signe/refuse`, computed `totalHT`/`totalTTC`. The original dictation is kept on the record (`transcript`) for traceability.
- Pages: `app/page.tsx` (list), `app/devis/nouveau/page.tsx` (dictation → generation → preview → save), `app/devis/[id]/page.tsx` (detail, status, print).

### Conventions shared by both apps

- Path alias `@/*` maps to each app's own root (repo root for Artisan Devis, `facturx/` for FacturX).
- Styling is plain CSS in each app's `app/globals.css` — no Tailwind or CSS-in-JS.
- Document numbers are sequential per year (`DEV-2026-0001`, `FA-2026-0001`) derived from the store's record count.
- API routes return French error messages with appropriate HTTP status codes.
