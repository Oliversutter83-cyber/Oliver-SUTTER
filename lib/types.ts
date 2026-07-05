export type DevisStatus = "brouillon" | "envoye" | "signe" | "refuse";

export interface ClientInfo {
  nom: string;
  telephone?: string | null;
  adresse?: string | null;
}

export interface LigneDevis {
  designation: string;
  quantite: number;
  unite: string; // "u", "m²", "ml", "h", "forfait"...
  prixUnitaireHT: number;
}

export interface Devis {
  id: string;
  numero: string;
  titre: string;
  client: ClientInfo;
  transcript: string; // la dictée d'origine, conservée pour traçabilité
  lignes: LigneDevis[];
  tauxTVA: number; // 10 pour rénovation, 20 pour neuf
  notes?: string | null;
  status: DevisStatus;
  createdAt: string;
  updatedAt: string;
}

export function totalHT(devis: Pick<Devis, "lignes">): number {
  return devis.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaireHT, 0);
}

export function totalTTC(devis: Pick<Devis, "lignes" | "tauxTVA">): number {
  return totalHT(devis) * (1 + devis.tauxTVA / 100);
}

export const STATUS_LABELS: Record<DevisStatus, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  signe: "Signé",
  refuse: "Refusé",
};
