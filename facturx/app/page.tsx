import Link from "next/link";
import { listArticles } from "@/lib/blog";
import LeadForm from "./LeadForm";

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default function Landing() {
  const articles = listArticles().slice(0, 3);

  return (
    <>
      <div className="hero">
        <div className="container">
          <span className="kicker">Réforme 2026 – 2027 · Conformité e-commerce</span>
          <h1 className="hero-title">
            La facturation électronique, réglée <em>une bonne fois pour toutes</em>.
          </h1>
          <p className="hero-sub">
            À partir de septembre 2026, un PDF ne suffira plus. FacturX Connect génère
            automatiquement des factures Factur-X conformes à la norme EN&nbsp;16931 pour chaque
            commande WooCommerce — sans changer vos habitudes.
          </p>
          <LeadForm />
          <p className="hero-note">
            Gratuit jusqu&apos;à 10 factures par mois, sans carte bancaire ·{" "}
            <Link href="/dashboard">Voir la démonstration</Link>
          </p>
        </div>
      </div>

      <div className="container">
        <div className="trust">
          <span>
            <Check /> Norme EN 16931
          </span>
          <span>
            <Check /> Format Factur-X 1.0
          </span>
          <span>
            <Check /> Données hébergées en Europe
          </span>
          <span>
            <Check /> Support en français
          </span>
        </div>
      </div>

      <section id="fonctionnement">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Fonctionnement</span>
            <h2>
              Conforme en <em>cinq minutes</em>, conforme pour toujours.
            </h2>
            <p>
              Aucune compétence technique requise. Vous installez, vous renseignez vos
              identifiants, tout le reste est automatique.
            </p>
          </div>
          <div className="steps-grid">
            <div className="step">
              <span className="num">01.</span>
              <h3>Installez l&apos;extension</h3>
              <p>
                Depuis votre administration WordPress, comme n&apos;importe quelle extension.
                Renseignez votre SIREN et votre numéro de TVA.
              </p>
            </div>
            <div className="step">
              <span className="num">02.</span>
              <h3>Vendez comme d&apos;habitude</h3>
              <p>
                Chaque commande génère sa facture Factur-X : un PDF impeccable pour votre client,
                des données structurées pour l&apos;administration.
              </p>
            </div>
            <div className="step">
              <span className="num">03.</span>
              <h3>Restez serein</h3>
              <p>
                Archivage, tableau de bord de conformité, et bientôt la transmission directe via
                plateforme agréée. Vous n&apos;y pensez plus.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="deadline">
            <div>
              <strong>Sept. 2026</strong>
              <span>Toutes les entreprises doivent recevoir des factures électroniques</span>
            </div>
            <div>
              <strong>Sept. 2027</strong>
              <span>Obligation d&apos;émission étendue aux TPE, PME et micro-entreprises</span>
            </div>
            <div>
              <strong>100 %</strong>
              <span>des boutiques françaises concernées — WooCommerce n&apos;est pas conforme en standard</span>
            </div>
          </div>
        </div>
      </section>

      <section id="tarifs">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Tarifs</span>
            <h2>
              Un prix simple, <em>sans engagement</em>.
            </h2>
            <p>Commencez gratuitement, passez au plan supérieur quand votre volume le justifie.</p>
          </div>
          <div className="pricing">
            <div className="price-card">
              <h3>Découverte</h3>
              <div className="price">
                0 € <small>pour toujours</small>
              </div>
              <ul>
                <li>10 factures Factur-X par mois</li>
                <li>Tableau de bord de conformité</li>
                <li>Téléchargement PDF et XML</li>
              </ul>
              <Link href="/dashboard" className="btn btn-ghost">
                Essayer la démo
              </Link>
            </div>
            <div className="price-card featured">
              <span className="price-tag">Recommandé</span>
              <h3>Standard</h3>
              <div className="price">
                19 € <small>/ mois</small>
              </div>
              <ul>
                <li>Factures illimitées</li>
                <li>Envoi automatique au client</li>
                <li>Archivage légal</li>
                <li>Support prioritaire par email</li>
              </ul>
              <Link href="/dashboard" className="btn">
                Commencer
              </Link>
            </div>
            <div className="price-card">
              <h3>Pro</h3>
              <div className="price">
                39 € <small>/ mois</small>
              </div>
              <ul>
                <li>Tout le plan Standard</li>
                <li>Transmission plateforme agréée</li>
                <li>Réception des factures fournisseurs</li>
                <li>Multi-boutiques</li>
              </ul>
              <Link href="/dashboard" className="btn btn-ghost">
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <span className="kicker">Questions fréquentes</span>
            <h2>
              Ce que les marchands nous <em>demandent</em>.
            </h2>
          </div>
          <div className="faq">
            <details>
              <summary>Ma boutique ne vend qu&apos;à des particuliers, suis-je concerné ?</summary>
              <p>
                Oui, partiellement. L&apos;obligation d&apos;émission concerne les ventes entre
                professionnels, mais toutes les entreprises devront recevoir des factures
                électroniques dès septembre 2026, et transmettre les données de leurs ventes aux
                particuliers (e-reporting). Par ailleurs, beaucoup de boutiques ont des clients
                professionnels sans le savoir.
              </p>
            </details>
            <details>
              <summary>Un PDF classique ne suffit-il pas ?</summary>
              <p>
                Non. La loi impose un format structuré (Factur-X, UBL ou CII) contenant des données
                lisibles par les logiciels comptables et l&apos;administration. Un PDF exporté ou
                scanné ne contient pas ces données.
              </p>
            </details>
            <details>
              <summary>Que se passe-t-il si je ne fais rien ?</summary>
              <p>
                Des pénalités par facture non conforme sont prévues, mais le risque le plus concret
                est opérationnel : clients professionnels qui refusent vos factures, fournisseurs
                que vous ne recevez plus, contrôle fiscal compliqué.
              </p>
            </details>
            <details>
              <summary>Dois-je changer de thème ou toucher au code de ma boutique ?</summary>
              <p>
                Non. L&apos;extension s&apos;installe comme n&apos;importe quelle extension
                WordPress et fonctionne avec votre configuration existante. Rien ne change pour
                vos clients.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <span className="kicker">Ressources</span>
            <h2>
              Comprendre la réforme, <em>sans jargon</em>.
            </h2>
          </div>
          {articles.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="card">
              <span className="card-title">{a.title}</span>
              <p className="card-desc">{a.description}</p>
              <span className="read-more">Lire l&apos;article →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="container">
          <div className="cta-band">
            <h2>
              Prêt bien <em>avant</em> l&apos;échéance.
            </h2>
            <p>
              Recevez le guide de conformité et votre accès à l&apos;extension. Gratuit
              jusqu&apos;à 10 factures par mois.
            </p>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
