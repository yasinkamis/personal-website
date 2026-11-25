import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllPosts, formatDate, type Lang } from '../services/blog';
import Logo from '../components/Logo';
import './Blog.css';

gsap.registerPlugin(ScrollTrigger);

const COPY = {
  en: {
    home: 'Home',
    kicker: 'The Blog',
    title: 'Notes on building for the web',
    subtitle: 'Thoughts on React, performance, SEO and the craft of shipping fast, polished frontends.',
    empty: 'No posts yet — check back soon.',
    read: 'Read article',
  },
  tr: {
    home: 'Ana Sayfa',
    kicker: 'Blog',
    title: 'Web için geliştirme notları',
    subtitle: 'React, performans, SEO ve hızlı, cilalı arayüzler geliştirme sanatı üzerine notlar.',
    empty: 'Henüz yazı yok — yakında tekrar bak.',
    read: 'Yazıyı oku',
  },
};

export default function Blog() {
  const { language, setLanguage } = useLanguage();
  const lang = language as Lang;
  const c = COPY[lang];
  const posts = getAllPosts();

  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Lenis smooth scroll ⇄ ScrollTrigger ── */
    const lenis = new Lenis({ lerp: reduced ? 1 : 0.09, wheelMultiplier: 0.95 });
    const onLenis = () => ScrollTrigger.update();
    lenis.on('scroll', onLenis);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      /* scroll progress bar */
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      });

      if (reduced) {
        gsap.set('.blog-reveal', { opacity: 1, y: 0 });
        return;
      }

      /* ── Hero entrance ── */
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('.blog-kicker', { y: 40, opacity: 0, duration: 0.7 })
        .from('.blog-title .word', {
          yPercent: 120,
          opacity: 0,
          rotateZ: 6,
          duration: 1.1,
          stagger: 0.09,
          ease: 'expo.out',
        }, '-=0.3')
        .from('.blog-subtitle', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.blog-topbar', { yPercent: -120, opacity: 0, duration: 0.7 }, '-=0.9')
        .from('.blog-orb', { scale: 0, opacity: 0, duration: 1.2, stagger: 0.15, ease: 'back.out(1.7)' }, '-=1');

      /* floating orbs loop */
      gsap.utils.toArray<HTMLElement>('.blog-orb').forEach((orb, i) => {
        gsap.to(orb, {
          y: i % 2 === 0 ? 40 : -40,
          x: i % 2 === 0 ? -30 : 30,
          duration: 6 + i,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      /* ── Cards reveal on scroll (exaggerated) ── */
      ScrollTrigger.batch('.blog-card', {
        start: 'top 88%',
        onEnter: batch =>
          gsap.fromTo(
            batch,
            { y: 90, opacity: 0, rotateX: -22, transformOrigin: 'center bottom' },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1,
              stagger: 0.14,
              ease: 'power4.out',
              overwrite: true,
            }
          ),
      });
    }, rootRef);

    /* ── Magnetic + 3D tilt on cards ── */
    const cards = gsap.utils.toArray<HTMLElement>('.blog-card');
    const cleanups: Array<() => void> = [];
    if (!reduced) {
      cards.forEach(card => {
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, {
            rotateY: px * 10,
            rotateX: -py * 10,
            y: -6,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 900,
          });
        };
        const onLeave = () =>
          gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        });
      });
    }

    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 150);

    return () => {
      clearTimeout(refreshId);
      ctx.revert();
      cleanups.forEach(fn => fn());
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [lang]);

  const titleWords = c.title.split(' ');

  return (
    <div className="blog-root" ref={rootRef}>
      <div className="blog-progress" ref={progressRef} />

      {/* animated background orbs */}
      <div className="blog-bg">
        <span className="blog-orb blog-orb-1" />
        <span className="blog-orb blog-orb-2" />
        <span className="blog-orb blog-orb-3" />
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
            <Link to="/blog" className="blog-nav-link active">Blog</Link>
            <div className="blog-lang">
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
              <button className={lang === 'tr' ? 'active' : ''} onClick={() => setLanguage('tr')}>TR</button>
            </div>
          </nav>
        </div>
      </header>

      <div className="blog-container">
        <header className="blog-header">
          <div className="blog-kicker">{c.kicker}</div>
          <h1 className="blog-title">
            {titleWords.map((w, i) => (
              <span className="word-mask" key={i}>
                <span className="word">{w}&nbsp;</span>
              </span>
            ))}
          </h1>
          <p className="blog-subtitle">{c.subtitle}</p>
        </header>

        {posts.length === 0 ? (
          <p className="blog-empty">{c.empty}</p>
        ) : (
          <div className="blog-list">
            {posts.map((post, i) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card blog-reveal">
                <span className="blog-card-index">{String(i + 1).padStart(2, '0')}</span>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span>{formatDate(post.date, lang)}</span>
                  </div>
                  <h2 className="blog-card-title">{post.title[lang]}</h2>
                  <p className="blog-card-excerpt">{post.excerpt[lang]}</p>
                  {post.tags.length > 0 && (
                    <div className="blog-tags">
                      {post.tags.map(tag => (
                        <span key={tag} className="blog-tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <span className="blog-card-cta">{c.read} <span className="arr">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
