import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { getArticle, listArticles } from "@/lib/blog";

export function generateStaticParams() {
  return listArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return { title: `${article.title} | AccessiScan`, description: article.description };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const html = marked.parse(article.body) as string;

  return (
    <section className="section">
      <div className="prose">
        <p>
          <Link href="/blog">← Toutes les ressources</Link>
        </p>
        <h1>{article.title}</h1>
        <time dateTime={article.date} style={{ color: "var(--ink-faint)" }}>
          {new Date(article.date + "T12:00:00").toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div className="result-cta" style={{ marginTop: "2.5rem" }}>
          <h3>Où en est votre site ?</h3>
          <p>Scannez-le gratuitement en 30 secondes — score RGAA et liste des non-conformités, sans inscription.</p>
          <Link href="/#scanner" className="btn btn-primary">
            Tester mon site gratuitement
          </Link>
        </div>
      </div>
    </section>
  );
}
