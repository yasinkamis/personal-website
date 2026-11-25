import { marked } from 'marked';

export type Lang = 'en' | 'tr';

export interface BlogPost {
  slug: string;
  date: string;          // ISO date, e.g. 2026-11-22
  cover?: string;        // optional cover image URL/path
  tags: string[];
  /** Per-language metadata; falls back to the other language if one is missing. */
  title: Record<Lang, string>;
  excerpt: Record<Lang, string>;
  /** Raw markdown body per language. */
  body: Record<Lang, string>;
}

marked.setOptions({ gfm: true, breaks: true });

/**
 * Minimal YAML-frontmatter parser (no Node Buffer dependency, browser-safe).
 * Supports simple `key: value` lines between the leading `---` fences.
 */
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) data[key] = value;
  }
  return { data, content: match[2] };
}

/**
 * The body may hold both languages separated by an `<!--tr-->` marker:
 * English before it, Turkish after. Without the marker the same body is used
 * for both languages.
 */
function splitBody(content: string): Record<Lang, string> {
  const parts = content.split(/<!--\s*tr\s*-->/i);
  const en = parts[0].trim();
  const tr = (parts[1] ?? parts[0]).trim();
  return { en, tr };
}

// Eagerly import every markdown file under /src/posts as a raw string.
const modules = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function buildPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, raw] of Object.entries(modules)) {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    const { data, content } = parseFrontmatter(raw);
    const body = splitBody(content);

    const titleEn = data.title ?? slug;
    const titleTr = data.titleTr ?? titleEn;
    const excerptEn = data.excerpt ?? '';
    const excerptTr = data.excerptTr ?? excerptEn;

    posts.push({
      slug,
      date: data.date ?? '',
      cover: data.cover || undefined,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      title: { en: titleEn, tr: titleTr },
      excerpt: { en: excerptEn, tr: excerptTr },
      body,
    });
  }

  // newest first
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return posts;
}

const allPosts = buildPosts();

export function getAllPosts(): BlogPost[] {
  return allPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find(p => p.slug === slug);
}

/** Render a post's body for the given language to sanitized-enough HTML. */
export function renderBody(post: BlogPost, lang: Lang): string {
  return marked.parse(post.body[lang] || post.body.en, { async: false }) as string;
}

export function formatDate(date: string, lang: Lang): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
