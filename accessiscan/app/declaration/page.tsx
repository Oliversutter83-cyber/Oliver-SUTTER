import type { Metadata } from "next";
import DeclarationForm from "./DeclarationForm";

export const metadata: Metadata = {
  title: "Générateur de déclaration d'accessibilité (modèle légal RGAA) — AccessiScan",
  description:
    "Générez gratuitement votre déclaration d'accessibilité conforme au modèle officiel (loi n° 2005-102, RGAA 4.1.2) en 2 minutes. Le document obligatoire que la DGCCRF vérifie en premier.",
};

export default function DeclarationPage() {
  return (
    <section className="section">
      <span className="kicker">Outil gratuit</span>
      <h1>Générez votre déclaration d'accessibilité</h1>
      <p className="lead">
        La déclaration d'accessibilité est <strong>obligatoire</strong> pour les services concernés par la
        loi : c'est le premier document qu'un contrôleur cherche sur votre site — et son absence est une
        non-conformité immédiate. Remplissez le formulaire, obtenez le texte conforme au modèle officiel,
        publiez-le sur une page « /accessibilite » de votre site.
      </p>
      <DeclarationForm />
    </section>
  );
}
