import type { Metadata } from "next";
import Link from "next/link";
import { listArticles } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Ressources accessibilité numérique — RGAA, amendes, obligations 2026 | AccessiScan",
  description:
    "Guides pratiques sur l'accessibilité numérique : obligations légales 2026, amendes, déclaration d'accessibilité, checklist RGAA pour l'e-commerce.",
};

export default function BlogPage() {
  const articles = listArticles();
  return (
    <section className="section">
      <span className="kicker">Ressources</span>
      <h1>Comprendre vos obligations d'accessibilité</h1>
      <p className="lead">
        Des guides écrits pour les dirigeants et les agences — pas pour les juristes.
      </p>
      <div className="blog-list">
        {articles.map((a) => (
          <article key={a.slug} className="blog-card">
            <time dateTime={a.date}>
              {new Date(a.date + "T12:00:00").toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <h2 style={{ margin: "0.4rem 0" }}>
              <Link href={`/blog/${a.slug}`}>{a.title}</Link>
            </h2>
            <p>{a.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
