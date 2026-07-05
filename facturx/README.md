# ⚡ FacturX Connect

**La facturation électronique automatique pour boutiques WooCommerce.** Chaque commande génère sa facture **Factur-X** (PDF avec données structurées XML embarquées, profil BASIC / EN 16931) — le format exigé par la réforme française 2026-2027.

> 📊 Cadrage business : [`../docs/BUSINESS-PLAN-FACTURX.md`](../docs/BUSINESS-PLAN-FACTURX.md)

## Architecture

```
Boutique WooCommerce                    SaaS FacturX Connect (ce dossier)
┌──────────────────────┐    commande   ┌─────────────────────────────────┐
│ wp-plugin/           │  ──────────►  │ POST /api/orders                │
│ facturx-connector.php│   JSON + clé  │  → XML CII (EN 16931, BASIC)    │
│ (connecteur léger)   │               │  → PDF avec XML embarqué        │
└──────────────────────┘               │  → archivage + tableau de bord  │
                                       └─────────────────────────────────┘
```

La valeur (et l'abonnement) vit dans le SaaS : génération conforme, archivage, tableau de bord, et demain la transmission via plateforme agréée. Le plugin WordPress n'est qu'un connecteur de ~100 lignes — facile à décliner pour PrestaShop, Shopify…

## Démarrage

```bash
cd facturx
npm install
npm run dev        # http://localhost:3000
```

Cliquez sur **« Simuler une commande »** pour générer une première facture sans boutique connectée, puis téléchargez le PDF et le XML depuis le tableau de bord.

### Sécuriser l'API (optionnel en démo)

```bash
FACTURX_API_KEY=une-cle-secrete npm run dev
```

Le connecteur WooCommerce enverra cette clé dans l'en-tête `x-api-key`.

### Identité vendeur

Variables d'environnement `SELLER_NAME`, `SELLER_ADDRESS`, `SELLER_SIREN`, `SELLER_VAT` (valeurs de démonstration par défaut). En production : par compte marchand.

## Limites connues du MVP (avant production)

1. **PDF/A-3** : le PDF embarque bien le XML (`AFRelationship.Data`) mais n'est pas encore certifié PDF/A-3 (métadonnées XMP, profils couleur) → post-traitement Ghostscript ou lib dédiée.
2. **Validation XSD/Schematron** : la structure suit le profil BASIC de Factur-X 1.0 ; valider contre les schémas officiels FNFE-MPE.
3. **Transmission PDP** : la V1 génère et archive ; le routage vers une plateforme de dématérialisation partenaire est la V2.
4. **Stockage** : JSON + fichiers locaux → Postgres + S3, multi-comptes, facturation Stripe.
5. **Connecteur WP** : non testé sur une installation WooCommerce réelle.
