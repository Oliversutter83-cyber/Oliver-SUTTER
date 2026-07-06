// Blog basé sur des fichiers Markdown avec frontmatter — zéro CMS, zéro coût.
import fs from "fs";
import path from "path";

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string; // markdown sans le frontmatter
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1");
    meta[key] = value;
  }
  return { meta, body: raw.slice(match[0].length) };
}

export function listArticles(): Article[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { meta, body } = parseFrontmatter(raw);
      return {
        slug: meta.slug ?? file.replace(/\.md$/, ""),
        title: meta.title ?? file,
        description: meta.description ?? "",
        date: meta.date ?? "",
        body,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): Article | undefined {
  return listArticles().find((a) => a.slug === slug);
}
