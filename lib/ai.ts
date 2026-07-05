// Génération de devis structurés à partir d'une dictée, via l'API Claude.
// Sans ANTHROPIC_API_KEY, bascule sur un générateur simulé pour que l'app
// reste utilisable en démo.
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

export const DevisGenereSchema = z.object({
  titre: z.string().describe("Titre court du devis, ex: 'Remplacement chauffe-eau 200L'"),
  client: z.object({
    nom: z.string().describe("Nom du client, ou 'Client' si non mentionné"),
    telephone: z.string().nullable(),
    adresse: z.string().nullable(),
  }),
  lignes: z.array(
    z.object({
      designation: z.string().describe("Désignation de la prestation ou fourniture"),
      quantite: z.number(),
      unite: z.string().describe("u, m², ml, h, forfait..."),
      prixUnitaireHT: z.number().describe("Prix unitaire HT en euros, réaliste pour le marché français"),
    })
  ),
  tauxTVA: z.number().describe("10 pour de la rénovation de logement de plus de 2 ans, 20 sinon"),
  notes: z.string().nullable().describe("Conditions, délais ou remarques utiles au client"),
});

export type DevisGenere = z.infer<typeof DevisGenereSchema>;

const SYSTEM_PROMPT = `Tu es l'assistant devis d'un artisan du bâtiment français.
À partir de la dictée de l'artisan, tu produis un devis structuré et professionnel :
- Décompose le chantier en lignes claires (main d'œuvre, fournitures, déplacement si pertinent).
- Propose des prix HT réalistes pour le marché français quand l'artisan n'en donne pas ; respecte scrupuleusement ceux qu'il donne.
- TVA : 10 % pour la rénovation d'un logement de plus de 2 ans, 20 % sinon. En cas de doute, 10 %.
- Reste fidèle à la dictée : n'invente ni client ni prestation non mentionnés.`;

export async function genererDevis(transcript: string): Promise<DevisGenere> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return mockDevis(transcript);
  }

  const client = new Anthropic();
  const response = await client.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: `Dictée de l'artisan :\n\n${transcript}` }],
    output_config: { format: zodOutputFormat(DevisGenereSchema) },
  });

  if (!response.parsed_output) {
    throw new Error(
      `Génération incomplète (stop_reason: ${response.stop_reason}). Réessayez.`
    );
  }
  return response.parsed_output;
}

// Générateur simulé — permet de tester l'UX de bout en bout sans clé API.
function mockDevis(transcript: string): DevisGenere {
  return {
    titre: transcript.slice(0, 60) || "Devis (mode démo)",
    client: { nom: "Client", telephone: null, adresse: null },
    lignes: [
      { designation: "Main d'œuvre (mode démo — configurez ANTHROPIC_API_KEY)", quantite: 3, unite: "h", prixUnitaireHT: 55 },
      { designation: "Fournitures", quantite: 1, unite: "forfait", prixUnitaireHT: 240 },
      { designation: "Déplacement", quantite: 1, unite: "forfait", prixUnitaireHT: 45 },
    ],
    tauxTVA: 10,
    notes: "Devis généré en mode démo. Ajoutez votre clé API Anthropic dans .env pour une génération réelle par IA.",
  };
}
