import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artisan Devis — vos devis à la voix",
  description:
    "Dictez votre chantier, obtenez un devis professionnel en 2 minutes. Pensé pour les artisans du bâtiment.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="topbar no-print">
          <Link href="/" className="brand">
            🛠️ Artisan Devis
          </Link>
          <Link href="/devis/nouveau" className="btn btn-primary">
            + Nouveau devis
          </Link>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
