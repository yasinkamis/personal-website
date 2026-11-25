import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useLanguage } from '../contexts/LanguageContext';
import { getPostBySlug, getAllPosts, renderBody, formatDate, type Lang } from '../services/blog';
import Logo from '../components/Logo';
import './Blog.css';

gsap.registerPlugin(ScrollTrigger);

const SITE_URL = 'https://www.yasinkamis.com';

const COPY = {
  en: { back: 'All posts', notFound: 'Post not found.', home: 'Home', blog: 'Blog', copy: 'Copy', copied: 'Copied!', related: 'Related posts' },
  tr: { back: 'Tüm yazılar', notFound: 'Yazı bulunamadı.', home: 'Ana Sayfa', blog: 'Blog', copy: 'Kopyala', copied: 'Kopyalandı!', related: 'İlgili yazılar' },
};

/** Set <head> meta for the current post and restore it on unmount. */
function applyPostMeta(
  post: NonNullable<ReturnType<typeof getPostBySlug>>,
  lang: Lang,
): () => void {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const title = post.title[lang];
  const desc = post.excerpt[lang] || '';
  const restore: Array<() => void> = [];

  const upsert = (attr: 'name' | 'property', key: string, content: string) => {
    const el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (el) {
      const prev = el.getAttribute('content');
      el.setAttribute('content', content);
      restore.push(() => { if (prev === null) el!.removeAttribute('content'); else el!.setAttribute('content', prev); });
    } else {
      const created = document.createElement('meta');
      created.setAttribute(attr, key);
      created.setAttribute('content', content);
      document.head.appendChild(created);
      restore.push(() => created.remove());
    }
  };

  upsert('name', 'description', desc);
  upsert('property', 'og:title', title);
  upsert('property', 'og:description', desc);
  upsert('property', 'og:type', 'article');
  upsert('property', 'og:url', url);
  upsert('name', 'twitter:title', title);
  upsert('name', 'twitter:description', desc);
  if (post.cover) upsert('property', 'og:image', post.cover.startsWith('http') ? post.cover : `${SITE_URL}${post.cover}`);

  const canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canon) {
    const prev = canon.getAttribute('href');
    canon.setAttribute('href', url);
    restore.push(() => { if (prev) canon.setAttribute('href', prev); });
  }

  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: desc,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: 'Yasin Kamış', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Yasin Kamış' },
    mainEntityOfPage: url,
    url,
    keywords: post.tags.join(', '),
    inLanguage: lang,
  });
  document.head.appendChild(ld);
  restore.push(() => ld.remove());

  return () => restore.forEach(fn => fn());
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { language, setLanguage } = useLanguage();
  const lang = language as Lang;
  const c = COPY[lang];
  const post = slug ? getPostBySlug(slug) : undefined;

  // Related posts: share at least one tag, else fall back to the latest others.
  const related = (() => {
    if (!post) return [];
    const others = getAllPosts().filter(p => p.slug !== post.slug);
    const byTag = others.filter(p => p.tags.some(t => post.tags.includes(t)));
    return (byTag.length > 0 ? byTag : others).slice(0, 3);
  })();

  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!post) {
      document.title = 'Blog — Yasin Kamış';
      return;
    }
    document.title = `${post.title[lang]} — Yasin Kamış`;
    const restore = applyPostMeta(post, lang);
    return () => { restore(); document.title = 'Yasin Kamış'; };
  }, [post, lang]);

  // Add a copy button to every code block once the markdown is rendered.
  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];
    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.code-copy')) return;
      pre.classList.add('has-copy');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy';
      btn.textContent = c.copy;
      const onClick = async () => {
        const code = pre.querySelector('code')?.textContent ?? '';
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = c.copied;
          btn.classList.add('copied');
          window.setTimeout(() => { btn.textContent = c.copy; btn.classList.remove('copied'); }, 1500);
        } catch { /* clipboard unavailable */ }
      };
      btn.addEventListener('click', onClick);
      pre.appendChild(btn);
      cleanups.push(() => { btn.removeEventListener('click', onClick); btn.remove(); pre.classList.remove('has-copy'); });
    });
    return () => cleanups.forEach(fn => fn());
  }, [post, lang, c.copy, c.copied]);

  useEffect(() => {
    if (!post) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({ lerp: reduced ? 1 : 0.09, wheelMultiplier: 0.95 });
    const onLenis = () => ScrollTrigger.update();
    lenis.on('scroll', onLenis);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      });

      if (reduced) {
        gsap.set('.post-body > *, .post-reveal', { opacity: 1, y: 0 });
        return;
      }

      /* header entrance */
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('.blog-topbar', { yPercent: -120, opacity: 0, duration: 0.7 })
        .from('.post-meta', { y: 24, opacity: 0, duration: 0.6 }, '-=0.3')
        .from('.post-title .word', {
          yPercent: 120, opacity: 0, rotateZ: 5, duration: 1, stagger: 0.07, ease: 'expo.out',
        }, '-=0.3')
        .from('.post-tags-wrap .blog-tag', { y: 16, opacity: 0, duration: 0.5, stagger: 0.06 }, '-=0.5')
        .from('.post-orb', { scale: 0, opacity: 0, duration: 1, stagger: 0.12, ease: 'back.out(1.7)' }, '-=0.8');

      gsap.utils.toArray<HTMLElement>('.post-orb').forEach((orb, i) => {
        gsap.to(orb, {
          y: i % 2 === 0 ? 50 : -50, x: i % 2 === 0 ? -24 : 24,
          duration: 7 + i, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      });

      /* reveal each top-level block of the rendered markdown */
      const blocks = bodyRef.current ? Array.from(bodyRef.current.children) : [];
      gsap.set(blocks, { opacity: 0, y: 40 });
      ScrollTrigger.batch(blocks, {
        start: 'top 90%',
        onEnter: batch =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', overwrite: true }),
      });
    }, rootRef);

    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => {
      clearTimeout(refreshId);
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [post, lang]);

  return (
    <div className="blog-root" ref={rootRef}>
      <div className="blog-progress" ref={progressRef} />

      <div className="blog-bg">
        <span className="blog-orb post-orb blog-orb-1" />
        <span className="blog-orb post-orb blog-orb-2" />
        <span className="blog-grid" />
      </div>

      <header className="blog-topbar">
        <div className="blog-topbar-inner">
          <Link to="/classic" className="blog-brand" aria-label="Yasin Kamış">
            <Logo size={30} />
            <span className="blog-brand-name">Yasin&nbsp;Kamış</span>
          </Link>
          <nav className="blog-nav">
            <Link to="/classic" className="blog-nav-link">{c.home}</Link>
            <Link to="/blog" className="blog-nav-link active">{c.blog}</Link>
            <div className="blog-lang">
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
              <button className={lang === 'tr' ? 'active' : ''} onClick={() => setLanguage('tr')}>TR</button>
            </div>
          </nav>
        </div>
      </header>

      <div className="blog-container">
        {!post ? (
          <div className="blog-notfound">
            <p>{c.notFound}</p>
            <Link to="/blog" className="blog-home">{c.back}</Link>
          </div>
        ) : (
          <article>
            <header className="post-header">
              <div className="post-meta">{formatDate(post.date, lang)}</div>
              <h1 className="post-title">
                {post.title[lang].split(' ').map((w, i) => (
                  <span className="word-mask" key={i}><span className="word">{w}&nbsp;</span></span>
                ))}
              </h1>
              {post.tags.length > 0 && (
                <div className="blog-tags post-tags-wrap">
                  {post.tags.map(tag => (
                    <span key={tag} className="blog-tag">#{tag}</span>
                  ))}
                </div>
              )}
              {post.cover && <img className="post-cover" src={post.cover} alt="" />}
            </header>

            <div
              className="post-body"
              ref={bodyRef}
              dangerouslySetInnerHTML={{ __html: renderBody(post, lang) }}
            />

            {related.length > 0 && (
              <section className="post-related">
                <h2 className="post-related-title">{c.related}</h2>
                <div className="post-related-list">
                  {related.map(r => (
                    <Link key={r.slug} to={`/blog/${r.slug}`} className="post-related-card">
                      <span className="prc-date">{formatDate(r.date, lang)}</span>
                      <span className="prc-title">{r.title[lang]}</span>
                      {r.tags.length > 0 && (
                        <span className="prc-tags">{r.tags.slice(0, 3).map(t => `#${t}`).join(' ')}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <footer className="post-footer">
              <Link to="/blog" className="blog-home">
                <span className="blog-home-dot">←</span> {c.back}
              </Link>
            </footer>
          </article>
        )}
      </div>
    </div>
  );
}
