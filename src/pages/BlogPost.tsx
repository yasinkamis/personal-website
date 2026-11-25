import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useLanguage } from '../contexts/LanguageContext';
import { getPostBySlug, renderBody, formatDate, type Lang } from '../services/blog';
import Logo from '../components/Logo';
import './Blog.css';

gsap.registerPlugin(ScrollTrigger);

const COPY = {
  en: { back: 'All posts', notFound: 'Post not found.', home: 'Home', blog: 'Blog' },
  tr: { back: 'Tüm yazılar', notFound: 'Yazı bulunamadı.', home: 'Ana Sayfa', blog: 'Blog' },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { language, setLanguage } = useLanguage();
  const lang = language as Lang;
  const c = COPY[lang];
  const post = slug ? getPostBySlug(slug) : undefined;

  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) document.title = `${post.title[lang]} — Blog`;
    return () => { document.title = 'Portfolio'; };
  }, [post, lang]);

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
