import Link from "next/link";
import ScanForm from "./ScanForm";
import LeadForm from "./LeadForm";
import CheckoutButton from "./CheckoutButton";

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero + scanner ---------- */}
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-badge">⚠ Loi en vigueur depuis le 28 juin 2025 — contrôles DGCCRF en cours</span>
          <h1>Votre site risque jusqu'à 50 000 € d'amende. Vérifiez-le en 30 secondes.</h1>
          <p className="lead">
            La directive européenne accessibilité s'applique désormais aux sites e-commerce et services en
            ligne français. AccessiScan détecte vos non-conformités RGAA, vous donne le plan d'action et
            génère votre déclaration d'accessibilité obligatoire.
          </p>
          <ScanForm />
          <div className="hero-proof">
            <span>✓ Sans inscription</span>
            <span>✓ Résultat immédiat</span>
            <span>✓ Basé sur le référentiel officiel RGAA 4.1.2</span>
          </div>
        </div>
      </section>

      {/* ---------- La menace légale ---------- */}
      <section className="section" id="obligations">
        <span className="kicker">Ce que dit la loi</span>
        <h2>L'accessibilité n'est plus une option, c'est une obligation contrôlée</h2>
        <p className="lead">
          Depuis le 28 juin 2025, la directive européenne 2019/882 (European Accessibility Act) impose
          l'accessibilité numérique aux entreprises privées : e-commerce, banques, transports, réservation en
          ligne… En France, la conformité s'évalue avec le RGAA et la DGCCRF est chargée des contrôles.
        </p>
        <div className="stats-band">
          <div className="stat">
            <strong>50 000 €</strong>
            <span>d'amende maximale par service non conforme, cumulable</span>
          </div>
          <div className="stat">
            <strong>+ de 10</strong>
            <span>salariés ou 2 M€ de CA : votre entreprise est concernée</span>
          </div>
          <div className="stat">
            <strong>96 %</strong>
            <span>des sites présentent des défauts d'accessibilité détectables</span>
          </div>
          <div className="stat">
            <strong>1 doc</strong>
            <span>obligatoire : la déclaration d'accessibilité publiée sur votre site</span>
          </div>
        </div>
      </section>

      {/* ---------- Comment ça marche ---------- */}
      <div className="section-alt-wrap">
        <section className="section" id="fonctionnement">
          <span className="kicker">Comment ça marche</span>
          <h2>De « suis-je en règle ? » à « je suis couvert » en trois étapes</h2>
          <div className="grid-3">
            <div className="card">
              <span className="step-num" aria-hidden="true">1</span>
              <h3>Scannez votre site</h3>
              <p>
                Entrez votre adresse : AccessiScan analyse votre code contre les critères RGAA testables —
                images sans alternative, formulaires sans étiquette, liens vides, zoom bloqué…
              </p>
            </div>
            <div className="card">
              <span className="step-num" aria-hidden="true">2</span>
              <h3>Corrigez avec le plan d'action</h3>
              <p>
                Chaque non-conformité est expliquée simplement, avec l'extrait de code fautif et la
                correction à faire — compréhensible par votre développeur ou votre agence.
              </p>
            </div>
            <div className="card">
              <span className="step-num" aria-hidden="true">3</span>
              <h3>Publiez votre déclaration</h3>
              <p>
                Générez la déclaration d'accessibilité conforme au modèle légal, publiez-la, et laissez la
                surveillance mensuelle vous alerter si une mise à jour casse votre conformité.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ---------- Anti-overlay ---------- */}
      <section className="section">
        <span className="kicker">Pourquoi pas un widget ?</span>
        <h2>Les widgets « accessibilité en 1 clic » ne vous protègent pas</h2>
        <p className="lead">
          Les overlays qui ajoutent un bouton flottant ne corrigent pas votre code : le RGAA évalue le code
          source, pas le widget. Aux États-Unis, des centaines d'entreprises équipées d'overlays ont été
          poursuivies quand même. AccessiScan travaille sur la seule chose qui compte juridiquement : votre
          code, votre plan de correction, votre déclaration.
        </p>
      </section>

      {/* ---------- Tarifs ---------- */}
      <div className="section-alt-wrap">
        <section className="section" id="tarifs">
          <span className="kicker">Tarifs</span>
          <h2>Moins cher qu'une heure d'avocat. Beaucoup moins cher qu'une amende.</h2>
          <p className="lead">Sans engagement. Paiement par carte, reçu immédiat, résiliation en un clic.</p>
          <div className="pricing">
            <div className="plan">
              <h3>Découverte</h3>
              <p className="price">
                0 € <small>pour toujours</small>
              </p>
              <ul>
                <li>Scan de votre page d'accueil</li>
                <li>Score de risque RGAA</li>
                <li>Liste des non-conformités détectées</li>
                <li>Extension WordPress gratuite</li>
              </ul>
              <Link href="/#scanner" className="btn btn-ghost">
                Scanner mon site
              </Link>
            </div>
            <div className="plan plan-featured">
              <span className="plan-badge">Recommandé</span>
              <h3>Pro</h3>
              <p className="price">
                29 € <small>/ mois par site</small>
              </p>
              <ul>
                <li>Audit de toutes les pages du site</li>
                <li>Plan d'action priorisé, prêt pour votre développeur</li>
                <li>Déclaration d'accessibilité légale générée</li>
                <li>Surveillance mensuelle + alertes email</li>
                <li>Rapport PDF à présenter en cas de contrôle</li>
                <li>Support par email sous 24 h</li>
              </ul>
              <CheckoutButton plan="pro" label="S'abonner — 29 €/mois" />
            </div>
            <div className="plan">
              <h3>Agence</h3>
              <p className="price">
                149 € <small>/ mois</small>
              </p>
              <ul>
                <li>Jusqu'à 20 sites clients</li>
                <li>Rapports en marque blanche à votre logo</li>
                <li>Tableau de bord multi-sites</li>
                <li>Déclarations générées pour chaque client</li>
                <li>Facturez l'audit 10× son coût à vos clients</li>
              </ul>
              <CheckoutButton plan="agence" label="S'abonner — 149 €/mois" variant="ghost" />
            </div>
          </div>
        </section>
      </div>

      {/* ---------- FAQ ---------- */}
      <section className="section" id="faq">
        <span className="kicker">Questions fréquentes</span>
        <h2>Ce que tout le monde demande</h2>
        <div className="faq">
          <details>
            <summary>Mon entreprise est-elle vraiment concernée ?</summary>
            <p className="faq-body">
              Si vous vendez en ligne à des consommateurs (e-commerce, réservation, billetterie, services
              bancaires…) et que votre entreprise dépasse 10 salariés ou 2 M€ de chiffre d'affaires, oui —
              depuis le 28 juin 2025. En dessous de ces seuils, vous êtes exonéré des sanctions EAA, mais vos
              clients, eux, choisissent déjà les sites utilisables par tous.
            </p>
          </details>
          <details>
            <summary>Le scan gratuit suffit-il à me rendre conforme ?</summary>
            <p className="faq-body">
              Non, et méfiez-vous de quiconque prétend le contraire. Un scan automatique détecte environ un
              tiers des critères RGAA. Il vous dit si vous êtes en risque (spoiler : presque toujours) et
              par où commencer. La conformité complète passe par la correction du code et une déclaration
              publiée — c'est ce que l'offre Pro outille de bout en bout.
            </p>
          </details>
          <details>
            <summary>Un widget d'accessibilité me met-il en règle ?</summary>
            <p className="faq-body">
              Non. Les overlays ne modifient pas votre code source, or c'est le code qui est évalué par le
              RGAA et par les auditeurs. La DGCCRF et les associations de défense des utilisateurs le savent
              parfaitement.
            </p>
          </details>
          <details>
            <summary>Qu'est-ce que la déclaration d'accessibilité obligatoire ?</summary>
            <p className="faq-body">
              Un document légal, publié sur votre site, qui décrit votre état de conformité RGAA, les
              contenus non accessibles, un moyen de contact et les voies de recours. Son absence est une
              non-conformité en soi, immédiatement visible par n'importe quel contrôleur — c'est la première
              chose à corriger. Notre générateur la produit en 2 minutes.
            </p>
          </details>
          <details>
            <summary>Combien de temps pour être en conformité ?</summary>
            <p className="faq-body">
              Publier votre déclaration : aujourd'hui. Corriger les non-conformités critiques détectées :
              généralement quelques jours de travail développeur. Un site totalement conforme RGAA : quelques
              semaines. L'important juridiquement est de démontrer une démarche engagée et documentée — ce
              que le rapport PDF mensuel atteste.
            </p>
          </details>
        </div>
      </section>

      {/* ---------- Capture email ---------- */}
      <div className="lead-band">
        <section className="section section-tight">
          <h2>Le guide 2026 de mise en conformité, gratuit</h2>
          <p>
            Recevez la checklist RGAA complète, le modèle de déclaration d'accessibilité et les 10
            corrections les plus fréquentes expliquées — plus l'accès anticipé à AccessiScan Pro.
          </p>
          <LeadForm source="home" />
        </section>
      </div>
    </>
  );
}
