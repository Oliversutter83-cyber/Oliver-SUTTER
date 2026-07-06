import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { marked } from "marked";
import { getArticle, listArticles } from "@/lib/blog";
import LeadForm from "../../LeadForm";

export function generateStaticParams() {
  return listArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return { title: `${article.title} | FacturX Connect`, description: article.description };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  // Le titre H1 vient du frontmatter — on retire le premier titre du markdown
  // pour éviter le doublon.
  const body = article.body.replace(/^#\s.*\r?\n/, "");
  const html = await marked.parse(body);

  return (
    <article className="article">
      <p className="article-meta">
        <Link href="/blog">Ressources</Link> ·{" "}
        {article.date &&
          new Date(article.date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
          })}
      </p>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div className="article-cta">
        <strong>Votre boutique sera-t-elle prête ?</strong>
        <p>
          Recevez le guide de conformité et votre accès à l&apos;extension — gratuit
          jusqu&apos;à 10 factures par mois.
        </p>
        <LeadForm />
      </div>
      <p>
        <Link href="/blog">← Toutes les ressources</Link>
      </p>
    </article>
  );
}
