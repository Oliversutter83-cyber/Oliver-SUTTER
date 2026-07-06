import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FacturX Connect — Facturation électronique pour WooCommerce",
  description:
    "Rendez votre boutique WooCommerce conforme à la réforme 2026-2027. Factures Factur-X (EN 16931) générées automatiquement à chaque commande. Installation en 5 minutes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d3b31",
};

function Wordmark() {
  return (
    <span className="wordmark">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect x="1.5" y="1.5" width="17" height="17" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="8" width="17" height="17" rx="3.5" fill="currentColor" />
      </svg>
      <span>
        FacturX<em>Connect</em>
      </span>
    </span>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand" aria-label="FacturX Connect — accueil">
              <Wordmark />
            </Link>
            <nav className="nav">
              <Link href="/blog">Ressources</Link>
              <Link href="/#tarifs">Tarifs</Link>
              <Link href="/dashboard" className="btn btn-ghost">
                Démo
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <Wordmark />
              <p>
                La facturation électronique automatique pour le e-commerce français. Conforme à la
                norme EN 16931, prêt pour les échéances 2026-2027.
              </p>
            </div>
            <div className="footer-col">
              <h4>Produit</h4>
              <Link href="/dashboard">Démonstration</Link>
              <Link href="/#tarifs">Tarifs</Link>
              <Link href="/#fonctionnement">Fonctionnement</Link>
            </div>
            <div className="footer-col">
              <h4>Ressources</h4>
              <Link href="/blog">Comprendre la réforme</Link>
              <Link href="/blog/factur-x-cest-quoi">Le format Factur-X</Link>
              <Link href="/blog/calendrier-facturation-electronique-2026-2027">
                Calendrier 2026-2027
              </Link>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="mailto:contact@facturx-connect.fr">contact@facturx-connect.fr</a>
              <span className="footer-note">Réponse sous 24 h ouvrées</span>
            </div>
          </div>
          <div className="footer-legal">
            <span>© 2026 FacturX Connect</span>
            <span>Mentions légales</span>
            <span>CGV</span>
            <span>Confidentialité</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
