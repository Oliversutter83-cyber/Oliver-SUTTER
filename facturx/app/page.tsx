import Link from "next/link";
import { listArticles } from "@/lib/blog";
import LeadForm from "./LeadForm";

export default function Landing() {
  const articles = listArticles().slice(0, 3);

  return (
    <>
      <section className="hero">
        <span className="badge badge-warn">Obligation légale — septembre 2026</span>
        <h1 className="hero-title">
          Votre boutique WooCommerce n&apos;est pas conforme à la facturation électronique.
        </h1>
        <p className="hero-sub">
          La réforme 2026-2027 impose des factures au format <strong>Factur-X</strong> — un PDF
          classique ne suffira plus. FacturX Connect génère automatiquement une facture conforme
          (norme EN 16931) à chaque commande. <strong>Installé → conforme en 5 minutes.</strong>
        </p>
        <LeadForm />
        <p className="muted">
          Gratuit jusqu&apos;à 10 factures/mois ·{" "}
          <Link href="/dashboard">Voir la démo en direct →</Link>
        </p>
      </section>

      <section className="card">
        <h2>Comment ça marche</h2>
        <ol className="steps">
          <li>
            <strong>Installez l&apos;extension</strong> sur votre WordPress et renseignez votre
            SIREN et numéro de TVA.
          </li>
          <li>
            <strong>Vendez comme d&apos;habitude</strong> — chaque commande génère sa facture
            Factur-X : le PDF pour votre client, les données XML pour l&apos;administration.
          </li>
          <li>
            <strong>Dormez tranquille</strong> — archivage, tableau de bord de conformité, et
            bientôt la transmission directe via plateforme agréée.
          </li>
        </ol>
      </section>

      <section id="tarifs">
        <h2>Tarifs</h2>
        <div className="pricing">
          <div className="price-card">
            <h3>Découverte</h3>
            <div className="price">0 €</div>
            <ul>
              <li>10 factures Factur-X / mois</li>
              <li>Tableau de bord</li>
              <li>Téléchargement PDF + XML</li>
            </ul>
          </div>
          <div className="price-card featured">
            <h3>Standard</h3>
            <div className="price">
              19 €<span className="muted">/mois</span>
            </div>
            <ul>
              <li>Factures illimitées</li>
              <li>Envoi automatique au client</li>
              <li>Archivage légal</li>
              <li>Support prioritaire par email</li>
            </ul>
          </div>
          <div className="price-card">
            <h3>Pro</h3>
            <div className="price">
              39 €<span className="muted">/mois</span>
            </div>
            <ul>
              <li>Tout Standard</li>
              <li>Transmission plateforme agréée (à venir)</li>
              <li>Réception factures fournisseurs</li>
              <li>Multi-boutiques</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Comprendre la réforme</h2>
        {articles.map((a) => (
          <Link key={a.slug} href={`/blog/${a.slug}`} className="card">
            <strong>{a.title}</strong>
            <p className="muted" style={{ margin: "0.25rem 0 0" }}>
              {a.description}
            </p>
          </Link>
        ))}
        <p>
          <Link href="/blog">Tous les articles →</Link>
        </p>
      </section>
    </>
  );
}
