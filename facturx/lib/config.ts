// Identité du vendeur (le marchand). En production : par compte utilisateur.
// Pour le MVP : variables d'environnement avec valeurs de démonstration.
export const SELLER = {
  name: process.env.SELLER_NAME ?? "Ma Boutique SARL",
  address: process.env.SELLER_ADDRESS ?? "10 rue du Commerce, 75011 Paris",
  siren: process.env.SELLER_SIREN ?? "123456789",
  vatNumber: process.env.SELLER_VAT ?? "FR32123456789",
};
