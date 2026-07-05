import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "FacturX Connect — facturation électronique WooCommerce",
  description:
    "Rendez votre boutique WooCommerce conforme à la réforme 2026-2027 : factures Factur-X générées automatiquement à chaque commande.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="topbar">
          <Link href="/" className="brand">
            ⚡ FacturX Connect
          </Link>
          <nav className="nav">
            <Link href="/blog">Blog</Link>
            <Link href="/#tarifs">Tarifs</Link>
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Démo
            </Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
