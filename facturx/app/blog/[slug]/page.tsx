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

  const html = await marked.parse(article.body);

  return (
    <article className="card article">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <hr />
      <div className="article-cta">
        <strong>Votre boutique sera-t-elle prête ?</strong>
        <p className="muted">
          Recevez le guide de conformité et l&apos;accès à l&apos;extension — gratuit jusqu&apos;à
          10 factures/mois.
        </p>
        <LeadForm />
      </div>
      <p>
        <Link href="/blog">← Tous les articles</Link>
      </p>
    </article>
  );
}
