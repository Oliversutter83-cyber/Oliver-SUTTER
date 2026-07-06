import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Manrope } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AccessiScan — Audit d'accessibilité RGAA et déclaration légale en ligne",
  description:
    "Votre site est-il conforme à la loi accessibilité 2025 ? Scannez-le gratuitement en 30 secondes, obtenez votre score RGAA et générez votre déclaration d'accessibilité obligatoire. Jusqu'à 50 000 € d'amende par service non conforme.",
  keywords: [
    "accessibilité numérique",
    "RGAA",
    "audit accessibilité site web",
    "déclaration d'accessibilité",
    "European Accessibility Act",
    "amende accessibilité",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1d5c",
};

function Wordmark() {
  return (
    <span className="wordmark">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="13" cy="8" r="2.4" fill="currentColor" />
        <path d="M7 11.5l4.5 1v3.5L9.5 20.5M19 11.5l-4.5 1v3.5l2 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </svg>
      <span>
        Accessi<em>Scan</em>
      </span>
    </span>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={sans.variable}>
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu principal
        </a>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand" aria-label="AccessiScan — accueil">
              <Wordmark />
            </Link>
            <nav className="nav" aria-label="Navigation principale">
              <Link href="/blog">Ressources</Link>
              <Link href="/declaration">Déclaration</Link>
              <Link href="/#tarifs">Tarifs</Link>
              <Link href="/login">Connexion</Link>
              <Link href="/#scanner" className="btn btn-primary btn-sm">
                Tester mon site
              </Link>
            </nav>
          </div>
        </header>

        <main id="contenu">{children}</main>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <Wordmark />
              <p>
                L'audit d'accessibilité RGAA automatisé et la déclaration légale, pour les sites
                français concernés par la directive européenne accessibilité (EAA).
              </p>
            </div>
            <div className="footer-col">
              <h4>Produit</h4>
              <Link href="/#scanner">Scanner gratuit</Link>
              <Link href="/declaration">Générateur de déclaration</Link>
              <Link href="/#tarifs">Tarifs</Link>
            </div>
            <div className="footer-col">
              <h4>Ressources</h4>
              <Link href="/blog">Comprendre vos obligations</Link>
              <Link href="/blog/amende-accessibilite-site-web-2026">Les amendes en 2026</Link>
              <Link href="/blog/declaration-accessibilite-obligatoire-modele">
                La déclaration obligatoire
              </Link>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="mailto:contact@accessiscan.fr">contact@accessiscan.fr</a>
              <span className="footer-note">Réponse sous 24 h ouvrées — uniquement par email</span>
            </div>
          </div>
          <div className="footer-legal">
            <span>© 2026 AccessiScan</span>
            <span>Mentions légales</span>
            <span>CGV</span>
            <span>Confidentialité</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
