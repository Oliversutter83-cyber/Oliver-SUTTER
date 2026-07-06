import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion — AccessiScan",
  description: "Accédez à votre tableau de bord AccessiScan par lien magique — sans mot de passe.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <section className="section" style={{ maxWidth: 560 }}>
      <span className="kicker">Espace client</span>
      <h1>Connexion</h1>
      <p className="lead">
        Pas de mot de passe : indiquez l'email utilisé lors de votre achat, vous recevez un lien de
        connexion.
      </p>
      {error === "lien-invalide" && (
        <p className="scan-error" role="alert">
          Ce lien de connexion n'est plus valide. Demandez-en un nouveau ci-dessous.
        </p>
      )}
      <LoginForm />
    </section>
  );
}
