import Link from "next/link";
import type { Metadata } from "next";
import { listArticles } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Ressources — Facturation électronique 2026-2027 | FacturX Connect",
  description:
    "Guides clairs sur la réforme de la facturation électronique pour les e-commerçants : calendrier, format Factur-X, conformité WooCommerce.",
};

export default function BlogIndex() {
  const articles = listArticles();
  return (
    <div className="page narrow">
      <span className="kicker">Ressources</span>
      <h1>
        Comprendre la facturation <em>électronique</em>.
      </h1>
      <p className="muted" style={{ marginBottom: "1.6rem" }}>
        Des réponses claires, sans jargon, pour préparer votre boutique aux échéances 2026-2027.
      </p>
      {articles.map((a) => (
        <Link key={a.slug} href={`/blog/${a.slug}`} className="card">
          <span className="card-title">{a.title}</span>
          <p className="card-desc">{a.description}</p>
          <span className="read-more">Lire l&apos;article →</span>
        </Link>
      ))}
    </div>
  );
}
