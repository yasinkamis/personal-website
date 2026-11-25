// Generates public/rss.xml and public/sitemap.xml from the markdown posts in
// src/posts, plus the static routes. Run before `vite build` (see package.json).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const postsDir = join(root, 'src', 'posts');
const publicDir = join(root, 'public');

const SITE = 'https://www.yasinkamis.com';

/** Minimal `key: value` frontmatter parser (matches services/blog.ts). */
function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key) data[key] = value;
  }
  return { data, content: match[2] };
}

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const posts = readdirSync(postsDir)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const raw = readFileSync(join(postsDir, file), 'utf8');
    const { data } = parseFrontmatter(raw);
    return {
      slug: file.replace(/\.md$/, ''),
      title: data.title || file,
      excerpt: data.excerpt || '',
      date: data.date || '',
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

/* ---------- RSS ---------- */
const now = new Date().toUTCString();
const items = posts
  .map((p) => {
    const link = `${SITE}/blog/${p.slug}`;
    const pub = p.date ? new Date(p.date).toUTCString() : now;
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pub}</pubDate>
      <description>${esc(p.excerpt)}</description>
    </item>`;
  })
  .join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yasin Kamış — Blog</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Notes on React, performance, SEO and building fast, polished frontends.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>
`;
writeFileSync(join(publicDir, 'rss.xml'), rss);

/* ---------- Sitemap ---------- */
const staticRoutes = [
  { loc: '/', changefreq: 'monthly', priority: '1.0' },
  { loc: '/classic', changefreq: 'monthly', priority: '0.9' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
  { loc: '/terminal', changefreq: 'monthly', priority: '0.6' },
];

const staticXml = staticRoutes
  .map(
    (r) => `  <url>
    <loc>${SITE}${r.loc}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n');

const postXml = posts
  .map(
    (p) => `  <url>
    <loc>${SITE}/blog/${p.slug}</loc>${p.date ? `\n    <lastmod>${p.date}</lastmod>` : ''}
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`,
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${postXml}
</urlset>
`;
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);

console.log(`gen-feed: wrote rss.xml + sitemap.xml (${posts.length} posts)`);
