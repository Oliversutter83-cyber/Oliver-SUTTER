// Génération de la déclaration d'accessibilité — le document légal exigé par
// l'article 47 de la loi n° 2005-102 et le décret n° 2019-768, selon le modèle
// officiel (RGAA 4.1.2). C'est le livrable que ni un widget ni un développeur
// pressé ne produit — notre cœur de valeur.

export interface DeclarationInput {
  orgName: string; // raison sociale
  siteUrl: string;
  siteName?: string;
  status: "non-conforme" | "partiellement-conforme" | "totalement-conforme";
  complianceRate?: number; // % de critères RGAA respectés (audit complet uniquement)
  auditDate: string; // ISO yyyy-mm-dd
  auditMethod: "automatise" | "manuel";
  contactEmail: string;
  technologies?: string; // ex. "HTML, CSS, JavaScript, WordPress"
  knownIssues?: string[]; // non-conformités principales relevées
}

const STATUS_LABEL: Record<DeclarationInput["status"], string> = {
  "non-conforme": "non conforme",
  "partiellement-conforme": "partiellement conforme",
  "totalement-conforme": "totalement conforme",
};

function frDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function generateDeclaration(input: DeclarationInput): string {
  const site = input.siteName ?? input.siteUrl;
  const statusLabel = STATUS_LABEL[input.status];

  const statusDetail =
    input.status === "totalement-conforme"
      ? ""
      : input.status === "partiellement-conforme" && input.complianceRate != null
        ? ` en raison des non-conformités énumérées ci-dessous. ${input.complianceRate} % des critères du RGAA version 4.1.2 sont respectés.`
        : input.auditMethod === "automatise"
          ? ", en l'absence d'audit de conformité complet permettant d'établir un taux de conformité."
          : " en raison des non-conformités énumérées ci-dessous.";

  const testResults =
    input.auditMethod === "automatise"
      ? `Une analyse automatisée réalisée le ${frDate(input.auditDate)} avec l'outil AccessiScan a porté sur les critères du RGAA testables automatiquement (environ un tiers du référentiel). Cette analyse ne constitue pas un audit de conformité au sens du RGAA ; un audit manuel complet est nécessaire pour établir un taux de conformité.`
      : `Un audit de conformité au RGAA version 4.1.2 réalisé le ${frDate(input.auditDate)} révèle que ${input.complianceRate != null ? `${input.complianceRate} % des critères sont respectés` : "le site présente les non-conformités énumérées ci-dessous"}.`;

  const issues =
    input.knownIssues && input.knownIssues.length
      ? `\n## Contenus non accessibles\n\nLes contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes :\n\n${input.knownIssues.map((i) => `- ${i}`).join("\n")}\n`
      : "";

  const technologies = input.technologies?.trim()
    ? `\n**Technologies utilisées pour la réalisation du site :** ${input.technologies}.\n`
    : "";

  return `# Déclaration d'accessibilité

${input.orgName} s'engage à rendre son service accessible, conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005.

Cette déclaration d'accessibilité s'applique à **${site}** (${input.siteUrl}).

## État de conformité

**${site}** est **${statusLabel}** avec le référentiel général d'amélioration de l'accessibilité (RGAA), version 4.1.2${statusDetail}

## Résultats des tests

${testResults}
${issues}
## Établissement de cette déclaration d'accessibilité

Cette déclaration a été établie le ${frDate(input.auditDate)}.
${technologies}
## Retour d'information et contact

Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable de ${site} pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.

- E-mail : ${input.contactEmail}

## Voies de recours

Cette procédure est à utiliser dans le cas suivant : vous avez signalé au responsable du site internet un défaut d'accessibilité qui vous empêche d'accéder à un contenu ou à un des services et vous n'avez pas obtenu de réponse satisfaisante.

Vous pouvez :

- Écrire un message au Défenseur des droits (https://formulaire.defenseurdesdroits.fr/)
- Contacter le délégué du Défenseur des droits dans votre région (https://www.defenseurdesdroits.fr/saisir/delegues)
- Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) : Défenseur des droits, Libre réponse 71120, 75342 Paris CEDEX 07
`;
}
