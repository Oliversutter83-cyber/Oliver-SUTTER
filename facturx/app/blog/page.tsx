import Link from "next/link";
import type { Metadata } from "next";
import { listArticles } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Facturation électronique 2026-2027 | FacturX Connect",
  description:
    "Guides clairs sur la réforme de la facturation électronique pour les e-commerçants : calendrier, format Factur-X, conformité WooCommerce.",
};

export default function BlogIndex() {
  const articles = listArticles();
  return (
    <>
      <h1>Comprendre la facturation électronique</h1>
      <p className="muted">
        Des réponses claires, sans jargon, pour préparer votre boutique aux échéances 2026-2027.
      </p>
      {articles.map((a) => (
        <Link key={a.slug} href={`/blog/${a.slug}`} className="card">
          <strong>{a.title}</strong>
          <p className="muted" style={{ margin: "0.25rem 0 0" }}>
            {a.description}
          </p>
        </Link>
      ))}
    </>
  );
}
