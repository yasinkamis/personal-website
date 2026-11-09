import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { createClassicScene, type SceneState } from '../three/ClassicScene';
import type { PortfolioData } from '../types';
import './ClassicSite.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Skill categories ── */
const SKILL_CATS: { label: string; labelTr: string; skills: string[]; color: string }[] = [
  {
    label: 'Frontend',
    labelTr: 'Frontend',
    color: 'blue',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Redux', 'Zustand', 'React Query', 'styled-components', 'MUI', 'Ant Design', 'Tailwind', 'Bootstrap', 'SCSS', 'HTML5', 'CSS3', 'Framer Motion', 'GSAP', 'Three.js'],
  },
  {
    label: 'AI & Agentic',
    labelTr: 'Yapay Zekâ & Agentic',
    color: 'pink',
    skills: ['Agentic AI', 'AI Agent Kits', 'AI-assisted Development', 'AI-integrated Apps', 'Developer Experience'],
  },
  {
    label: 'Backend & Auth',
    labelTr: 'Backend & Kimlik',
    color: 'green',
    skills: ['Node.js', 'GraphQL', 'REST', 'Keycloak', 'PKCE / OAuth', 'CMS Architecture'],
  },
  {
    label: 'Cloud & DevOps',
    labelTr: 'Bulut & DevOps',
    color: 'orange',
    skills: ['Kubernetes', 'ArgoCD', 'Harbor', 'Docker', 'Jenkins', 'GitLab CI/CD', 'Nginx', 'Git', 'Webpack', 'Vite', 'ESLint'],
  },
  {
    label: 'Design',
    labelTr: 'Tasarım',
    color: 'purple',
    skills: ['Figma', 'Photoshop', 'Illustrator', 'Adobe XD', 'Design Systems'],
  },
  {
    label: 'Leadership',
    labelTr: 'Liderlik',
    color: 'cyan',
    skills: ['Team Leadership', 'Mentoring', 'Code Review', 'Architecture', 'Agile / Scrum', 'Jira'],
  },
];

const FEATURED: { name: string; en: string; tr: string; c: string }[] = [
  { name: 'React', en: 'UI engineering', tr: 'Arayüz mühendisliği', c: 'blue' },
  { name: 'TypeScript', en: 'Type-safe at scale', tr: 'Ölçekte tip güvenliği', c: 'purple' },
  { name: 'Next.js', en: 'Full-stack React', tr: 'Full-stack React', c: 'green' },
  { name: 'Agentic AI', en: 'AI-driven workflows', tr: 'Yapay zekâ destekli akışlar', c: 'pink' },
];

const MARQUEE_A = ['React', 'TypeScript', 'Next.js', 'Three.js', 'GSAP', 'Agentic AI', 'Keycloak', 'GraphQL'];
const MARQUEE_B = ['Kubernetes', 'ArgoCD', 'Docker', 'Figma', 'Vite', 'Tailwind', 'Jenkins', 'SCSS'];

const NAV_LINKS = [
  { href: '#about', label: 'About', labelTr: 'Hakkımda' },
  { href: '#skills', label: 'Skills', labelTr: 'Yetenekler' },
  { href: '#experience', label: 'Experience', labelTr: 'Deneyim' },
  { href: '#education', label: 'Education', labelTr: 'Eğitim' },
  { href: '#testimonials', label: 'References', labelTr: 'Referanslar' },
  { href: '#contact', label: 'Contact', labelTr: 'İletişim' },
];

/* ── Typewriter hook ── */
function useTypewriter(texts: string[]) {
  const [display, setDisplay] = useState('');
  const textsKey = texts.join('|');

  useEffect(() => {
    let cancelled = false;
    let textIdx = 0;
    let charIdx = 0;
    let deleting = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    const tick = () => {
      if (cancelled) return;
      const current = texts[textIdx % texts.length];
      if (!deleting) {
        if (charIdx < current.length) {
          charIdx++;
          setDisplay(current.slice(0, charIdx));
          later(tick, 90);
        } else {
          later(() => { deleting = true; tick(); }, 2000);
        }
      } else if (charIdx > 0) {
        charIdx--;
        setDisplay(current.slice(0, charIdx));
        later(tick, 40);
      } else {
        deleting = false;
        textIdx++;
        later(tick, 300);
      }
    };
    later(tick, 1800);
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textsKey]);

  return display;
}

/* ── Split text into masked words/chars (done in JSX so React owns the DOM) ── */
function Split({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`cs-split ${className}`} aria-label={text}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} aria-hidden="true">
          {wi > 0 ? ' ' : null}
          <span className="cs-word">
            {[...word].map((ch, ci) => (
              <span key={ci} className="cs-ch-wrap"><span className="cs-ch">{ch}</span></span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ════════════════════════════════════════════════
   WRAPPER (loading gate)
   ════════════════════════════════════════════════ */
export default function ClassicSite() {
  const { data } = useData();
  if (!data) {
    return (
      <div className="cs-loading">
        <div className="cs-loading-dot" /><div className="cs-loading-dot" /><div className="cs-loading-dot" />
      </div>
    );
  }
  return <ClassicContent data={data} />;
}

/* ════════════════════════════════════════════════
   CONTENT
   ════════════════════════════════════════════════ */
function ClassicContent({ data }: { data: PortfolioData }) {
  const { language, setLanguage } = useLanguage();
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const sceneState = useRef<SceneState>({ scroll: 0, mx: 0, my: 0, velocity: 0, boost: 0 });

  const t = (en: string, tr: string) => (language === 'tr' ? tr : en);

  const typeTitles = useMemo(() => (
    language === 'tr'
      ? ['Frontend Geliştirici', 'Takım Lideri', 'UI/UX Tutkunu', 'Creative Developer']
      : ['Frontend Developer', 'Team Lead', 'UI/UX Enthusiast', 'Creative Developer']
  ), [language]);
  const typed = useTypewriter(typeTitles);

  const { personal, overview, workExperience, testimonials, education, contact } = data;

  /* ── Master setup: smooth scroll, 3D scene, every GSAP animation ── */
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const cleanups: (() => void)[] = [];
    const cleanupsEarly = cleanups;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const st = sceneState.current;
    const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, root);

    /* Lenis ⇄ ScrollTrigger */
    const lenis = new Lenis({ lerp: reduced ? 1 : 0.085, wheelMultiplier: 0.95 });
    lenisRef.current = lenis;
    lenis.stop();
    const onLenis = () => ScrollTrigger.update();
    lenis.on('scroll', onLenis);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /* WebGL */
    let scene: ReturnType<typeof createClassicScene> | null = null;
    try {
      scene = createClassicScene(canvas, st);
    } catch {
      canvas.style.display = 'none';
    }

    const onMove = (e: PointerEvent) => {
      st.mx = (e.clientX / window.innerWidth - 0.5) * 2;
      st.my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);

    const ctx = gsap.context(() => {
      /* ── Scroll → scene + progress bar + nav ── */
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: self => {
          st.scroll = self.progress;
          st.velocity = self.getVelocity() / 120;
          setNavScrolled(self.scroll() > 60);
        },
      });
      /* dim the 3D scene once past the hero so content stays readable (cheap: opacity only) */
      gsap.to('.cs-canvas', { opacity: 0.34, ease: 'none', scrollTrigger: { trigger: '.cs-hero', start: 'top top', end: 'bottom 35%', scrub: true } });
      gsap.to('.cs-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

      /* ── Preloader → hero intro ── */
      const counter = { v: 0 };
      const numEl = q('.cs-preloader-num')[0];
      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
      intro
        .to(counter, {
          v: 100,
          duration: reduced ? 0.3 : 1.7,
          ease: 'power2.inOut',
          onUpdate: () => { if (numEl) numEl.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
        })
        .to('.cs-preloader-bar-fill', { scaleX: 1, duration: reduced ? 0.3 : 1.7, ease: 'power2.inOut' }, 0)
        .to('.cs-preloader-inner', { yPercent: -30, opacity: 0, duration: 0.6, ease: 'power3.in' })
        .to('.cs-preloader', { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, '-=0.2')
        .add(() => { lenis.start(); }, '-=0.5')
        .from('.cs-hero .cs-ch', { yPercent: 120, rotate: 10, duration: 1.25, stagger: 0.035 }, '-=0.5')
        .from('.cs-hero-greeting, .cs-hero-title-row, .cs-hero-bio', { y: 30, opacity: 0, duration: 1, stagger: 0.12 }, '-=0.9')
        .from('.cs-hero-ctas > *, .cs-hero-stat', { y: 40, opacity: 0, duration: 0.9, stagger: 0.08 }, '-=0.8')
        .from('.cs-nav', { yPercent: -100, opacity: 0, duration: 0.9 }, '-=0.9')
        .from('.cs-hero-scroll', { opacity: 0, y: -20, duration: 0.8 }, '-=0.6')
        .set('.cs-preloader', { display: 'none' });
      gsap.set('.cs-preloader-inner', { opacity: 1 });

      /* ── Hero parallax out ── */
      gsap.to('.cs-hero-content', {
        yPercent: -22, opacity: 0.0, ease: 'none',
        scrollTrigger: { trigger: '.cs-hero', start: 'top top', end: 'bottom top', scrub: true },
      });

      /* ── Generic reveals ── */
      if (reduced) {
        gsap.set('.cs-reveal', { opacity: 1, y: 0 });
      } else {
        ScrollTrigger.batch(q('.cs-reveal'), {
          start: 'top 90%',
          once: true,
          onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, overwrite: true }),
        });
      }

      /* ── Section title char reveal ── */
      q('.cs-section-title').forEach(title => {
        if (reduced) return;
        gsap.from(title.querySelectorAll('.cs-ch'), {
          yPercent: 115, rotate: 7, duration: 1.1, ease: 'power4.out', stagger: 0.03,
          scrollTrigger: { trigger: title, start: 'top 88%', once: true },
        });
      });

      /* ── Big section numbers parallax ── */
      q('.cs-bignum').forEach(el => {
        gsap.fromTo(el, { yPercent: 40 }, {
          yPercent: -40, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      /* ── Stat counters ── */
      q('[data-count]').forEach(el => {
        const target = Number(el.dataset.count) || 0;
        const o = { v: 0 };
        const suffix = el.dataset.suffix ?? '';
        gsap.to(o, {
          v: target, duration: 2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => { el.textContent = Math.round(o.v) + suffix; },
        });
      });

      /* ── Marquee, velocity-reactive ── */
      const tweens = q('.cs-marquee-track').map((track, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const tw = gsap.fromTo(track, { xPercent: dir === 1 ? 0 : -50 }, { xPercent: dir === 1 ? -50 : 0, duration: 38, ease: 'none', repeat: -1 });
        return { tw, dir };
      });
      const marqueeEl = q('.cs-marquee')[0];
      const setSkew = marqueeEl ? gsap.quickSetter(marqueeEl, 'skewY', 'deg') : null;
      let mv = 0;
      let skew = 0;
      const marqueeTick = () => {
        const target = reduced ? 0 : Math.min(Math.abs(ScrollTrigger.getAll()[0]?.getVelocity() ?? 0) / 220, 9);
        mv += (target - mv) * 0.12;
        tweens.forEach(({ tw }) => tw.timeScale(1 + mv));
        const sTarget = gsap.utils.clamp(-4, 4, (ScrollTrigger.getAll()[0]?.getVelocity() ?? 0) / -450);
        skew += (sTarget - skew) * 0.12;
        setSkew?.(skew);
      };
      gsap.ticker.add(marqueeTick);
      cleanupsEarly.push(() => gsap.ticker.remove(marqueeTick));

      /* ── Skills: rows draw their rule, items cascade in ── */
      q('.cs-stack-row').forEach(row => {
        if (reduced) return;
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%', once: true } });
        tl.from(row, { '--rule': 0, duration: 1.1, ease: 'power3.out' })
          .from(row.querySelectorAll('.cs-stack-meta > *'), { y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0.05)
          .from(row.querySelectorAll('.cs-stack-items li'), { y: 18, opacity: 0, duration: 0.6, stagger: 0.025, ease: 'power2.out' }, 0.2);
      });

      /* ── Experience: pinned horizontal scroll on desktop ── */
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const pin = q('.cs-exp-pin')[0];
        const track = q('.cs-exp-track')[0];
        if (!pin || !track) return;
        const distance = () => Math.max(track.scrollWidth - window.innerWidth + 160, 0);
        const move = gsap.to(track, {
          x: () => -distance(), ease: 'none',
          scrollTrigger: {
            trigger: pin, start: 'top top', end: () => `+=${distance()}`,
            pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: self => { gsap.set('.cs-exp-bar-fill', { scaleX: self.progress }); },
          },
        });
        q('.cs-exp-card').forEach(card => {
          gsap.fromTo(card, { rotateY: 28, scale: 0.9, opacity: 0.35 }, {
            rotateY: 0, scale: 1, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: move, start: 'left 95%', end: 'left 45%', scrub: true },
          });
        });
      });

      /* ── Timeline cards (mobile) already covered by .cs-reveal ── */

      /* ── Contact: boost the 3D core on hover ── */
      q('.cs-contact-cta').forEach(el => {
        el.addEventListener('pointerenter', () => gsap.to(st, { boost: 1, duration: 0.8, ease: 'power3.out' }));
        el.addEventListener('pointerleave', () => gsap.to(st, { boost: 0, duration: 1, ease: 'power3.out' }));
      });
      gsap.fromTo('.cs-footer-giant', { xPercent: 12 }, {
        xPercent: -22, ease: 'none',
        scrollTrigger: { trigger: '.cs-footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
      });

      /* ── Tilt cards ── */
      if (fine && !reduced) {
        q('.cs-tilt').forEach(el => {
          const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
          const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
          gsap.set(el, { transformPerspective: 900 });
          el.addEventListener('pointermove', (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            ry((x - 0.5) * 14);
            rx(-(y - 0.5) * 14);
            el.style.setProperty('--mx', `${x * 100}%`);
            el.style.setProperty('--my', `${y * 100}%`);
          });
          el.addEventListener('pointerleave', () => { rx(0); ry(0); });
        });

        /* ── Magnetic buttons ── */
        q('.cs-magnetic').forEach(el => {
          const xt = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,0.5)' });
          const yt = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,0.5)' });
          el.addEventListener('pointermove', (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xt((e.clientX - (r.left + r.width / 2)) * 0.35);
            yt((e.clientY - (r.top + r.height / 2)) * 0.35);
          });
          el.addEventListener('pointerleave', () => { xt(0); yt(0); });
        });

        /* ── Custom cursor ── */
        const dot = q('.cs-cursor-dot')[0];
        const ring = q('.cs-cursor-ring')[0];
        if (dot && ring) {
          const dx = gsap.quickTo(dot, 'x', { duration: 0.08 });
          const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
          const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
          const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
          const move = (e: PointerEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
          window.addEventListener('pointermove', move);
          const over = (e: PointerEvent) => {
            const hot = (e.target as HTMLElement).closest('a, button, .cs-tilt, .cs-magnetic');
            ring.classList.toggle('cs-cursor-hot', !!hot);
          };
          window.addEventListener('pointerover', over);
          root.classList.add('cs-has-cursor');
          cleanups.push(() => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over); });
        }
      }
    }, root);

    /* Active section */
    const sections = root.querySelectorAll('section[id]');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: '-40% 0px -50% 0px' },
    );
    sections.forEach(s => io.observe(s));

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      cleanups.forEach(fn => fn());
      io.disconnect();
      window.removeEventListener('load', onLoad);
      window.removeEventListener('pointermove', onMove);
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.off('scroll', onLenis);
      lenis.destroy();
      lenisRef.current = null;
      scene?.dispose();
    };
  }, []);

  /* text lengths change with the language → re-measure pins */
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => clearTimeout(id);
  }, [language]);

  const scrollTo = useCallback((href: string) => {
    setMenuOpen(false);
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(href, { duration: 1.6, easing: x => 1 - Math.pow(1 - x, 4) });
    else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const navAnchor = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollTo(href); };

  return (
    <div className="classic-site" ref={rootRef}>
      <canvas ref={canvasRef} className="cs-canvas" />
      <div className="cs-progress" />
      <div className="cs-cursor-ring" />
      <div className="cs-cursor-dot" />

      {/* ── PRELOADER ── */}
      <div className="cs-preloader">
        <div className="cs-preloader-inner">
          <div className="cs-preloader-logo">&lt;YK/&gt;</div>
          <div className="cs-preloader-num">000</div>
          <div className="cs-preloader-bar"><div className="cs-preloader-bar-fill" /></div>
          <div className="cs-preloader-text">{t('initializing experience', 'deneyim hazırlanıyor')}</div>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav className={`cs-nav ${navScrolled ? 'cs-nav-scrolled' : ''}`}>
        <div className="cs-nav-inner">
          <a href="#hero" className="cs-logo cs-magnetic" onClick={navAnchor('#hero')}>
            <span className="cs-logo-bracket">&lt;</span>YK<span className="cs-logo-bracket">/&gt;</span>
          </a>

          <ul className="cs-nav-links cs-nav-links-desktop">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`cs-nav-link ${activeSection === link.href.slice(1) ? 'cs-nav-link-active' : ''}`}
                  onClick={navAnchor(link.href)}
                >
                  {t(link.label, link.labelTr)}
                </a>
              </li>
            ))}
          </ul>

          <div className="cs-nav-mid">
            <button
              className="cs-lang-btn"
              onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
              title={t('Switch to Turkish', 'Switch to English')}
            >
              {language.toUpperCase()}
            </button>
            <Link to="/terminal" className="cs-terminal-btn cs-magnetic">
              <span className="cs-terminal-btn-icon">$_</span>Terminal
            </Link>
          </div>

          <button
            className={`cs-hamburger ${menuOpen ? 'cs-hamburger-open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <ul className={`cs-nav-links cs-nav-links-mobile ${menuOpen ? 'cs-nav-links-open' : ''}`}>
        {NAV_LINKS.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              className={`cs-nav-link ${activeSection === link.href.slice(1) ? 'cs-nav-link-active' : ''}`}
              onClick={navAnchor(link.href)}
            >
              {t(link.label, link.labelTr)}
            </a>
          </li>
        ))}
      </ul>

      {/* ── HERO ── */}
      <section id="hero" className="cs-hero">
        <div className="cs-hero-content">
          <p className="cs-hero-greeting">
            <span className="cs-live-dot" />{overview.greeting}
          </p>
          <h1 className="cs-hero-name">
            <Split text={personal.name.toUpperCase()} />
          </h1>
          <div className="cs-hero-title-row">
            <span className="cs-hero-cursor-bracket">&gt;</span>
            <span className="cs-hero-typed">{typed}</span>
            <span className="cs-hero-caret" />
          </div>
          <p className="cs-hero-bio">{overview.description.length > 220 ? `${overview.description.slice(0, 217)}…` : overview.description}</p>
          <div className="cs-hero-ctas">
            <a href="#contact" className="cs-btn cs-btn-primary cs-magnetic" onClick={navAnchor('#contact')}>
              {t('Contact Me', 'İletişime Geç')}<span className="cs-btn-arrow">↗</span>
            </a>
            <a href={contact.social.github} target="_blank" rel="noopener noreferrer" className="cs-btn cs-btn-ghost cs-magnetic">
              GitHub
            </a>
          </div>
          <div className="cs-hero-stats">
            <div className="cs-hero-stat">
              <span className="cs-hero-stat-val" data-count={overview.yearsOfExperience} data-suffix="+">0+</span>
              <span className="cs-hero-stat-label">{t('Years Experience', 'Yıl Deneyim')}</span>
            </div>
            <div className="cs-hero-stat-divider" />
            <div className="cs-hero-stat">
              <span className="cs-hero-stat-val" data-count={overview.projectsCompleted} data-suffix="+">0+</span>
              <span className="cs-hero-stat-label">{t('Projects Completed', 'Tamamlanan Proje')}</span>
            </div>
          </div>
        </div>
        <a href="#about" className="cs-hero-scroll" onClick={navAnchor('#about')}>
          <span className="cs-hero-scroll-label">scroll</span>
          <span className="cs-hero-scroll-line"><span className="cs-hero-scroll-dot" /></span>
        </a>
      </section>

      {/* ── MARQUEE ── */}
      <div className="cs-marquee" aria-hidden="true">
        {[MARQUEE_A, MARQUEE_B].map((row, ri) => (
          <div key={ri} className={`cs-marquee-row ${ri ? 'cs-marquee-outline' : ''}`}>
            <div className="cs-marquee-track">
              {[...row, ...row, ...row, ...row].map((w, i) => (
                <span key={i} className="cs-marquee-item">{w}<i>✦</i></span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── ABOUT ── */}
      <section id="about" className="cs-section cs-about">
        <span className="cs-bignum">01</span>
        <div className="cs-container">
          <div className="cs-section-header">
            <span className="cs-tag cs-reveal">{t('about', 'hakkımda')}.ts</span>
            <h2 className="cs-section-title"><Split text={t('About Me', 'Hakkımda')} /></h2>
          </div>
          <div className="cs-about-grid">
            <div className="cs-about-bio cs-glass cs-reveal">
              {personal.bio.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
              <div className="cs-about-meta">
                <div className="cs-meta-item"><span className="cs-meta-icon">📍</span><span>{personal.location}</span></div>
                <div className="cs-meta-item"><span className="cs-meta-icon">✉️</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
                <div className="cs-meta-item"><span className="cs-meta-icon">🟢</span><span>{contact.availability}</span></div>
              </div>
            </div>
            <div className="cs-about-cards">
              {[
                { val: overview.yearsOfExperience, suffix: '+', label: t('Years of Experience', 'Yıl Deneyim'), color: 'blue' },
                { val: overview.projectsCompleted, suffix: '+', label: t('Projects Completed', 'Tamamlanan Proje'), color: 'green' },
                { val: personal.skills.length, suffix: '', label: t('Technologies', 'Teknoloji'), color: 'purple' },
                { val: workExperience.length, suffix: '', label: t('Companies', 'Şirket'), color: 'orange' },
              ].map((card, i) => (
                <div key={i} className={`cs-stat-card cs-stat-card-${card.color} cs-glass cs-tilt cs-reveal`}>
                  <span className="cs-stat-card-val" data-count={card.val} data-suffix={card.suffix}>0</span>
                  <span className="cs-stat-card-label">{card.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="cs-section cs-skills">
        <span className="cs-bignum">02</span>
        <div className="cs-container">
          <div className="cs-section-header">
            <span className="cs-tag cs-reveal">{t('skills', 'yetenekler')}.json</span>
            <h2 className="cs-section-title"><Split text={t('Technical Skills', 'Teknik Yetenekler')} /></h2>
          </div>
          <div className="cs-stack-featured">
            {FEATURED.map(f => (
              <div key={f.name} className={`cs-stack-tile cs-c-${f.c} cs-tilt cs-reveal`}>
                <span className="cs-stack-tile-kicker">{language === 'tr' ? f.tr : f.en}</span>
                <span className="cs-stack-tile-name">{f.name}</span>
                <span className="cs-stack-tile-arrow">↗</span>
              </div>
            ))}
          </div>

          <div className="cs-stack-list">
            {SKILL_CATS.map((cat, ci) => (
              <div key={ci} className={`cs-stack-row cs-c-${cat.color}`}>
                <div className="cs-stack-meta">
                  <span className="cs-stack-num">{String(ci + 1).padStart(2, '0')}</span>
                  <h3 className="cs-stack-name">{language === 'tr' ? cat.labelTr : cat.label}</h3>
                  <span className="cs-stack-count">{cat.skills.length} {t('tools', 'araç')}</span>
                </div>
                <ul className="cs-stack-items">
                  {cat.skills.map(skill => <li key={skill}>{skill}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE (pinned horizontal on desktop) ── */}
      <section id="experience" className="cs-section cs-experience">
        <div className="cs-exp-pin">
          <div className="cs-exp-head">
            <span className="cs-tag cs-reveal">{t('experience', 'deneyim')}.log</span>
            <h2 className="cs-section-title"><Split text={t('Work Experience', 'İş Deneyimi')} /></h2>
            <div className="cs-exp-bar"><div className="cs-exp-bar-fill" /></div>
          </div>
          <div className="cs-exp-track">
            {workExperience.map((exp, i) => (
              <article key={exp.id} className="cs-exp-card cs-glass">
                <span className="cs-exp-index">{String(i + 1).padStart(2, '0')}</span>
                <div className="cs-exp-header">
                  <div>
                    <h3 className="cs-exp-position">{exp.position}</h3>
                    <p className="cs-exp-company">{exp.company}</p>
                  </div>
                  <div className="cs-exp-meta-right">
                    <span className="cs-exp-duration">{exp.duration}</span>
                    <span className="cs-exp-location">{exp.location}</span>
                  </div>
                </div>
                <p className="cs-exp-desc">{exp.description.split('\n')[0]}</p>
                {exp.achievements.length > 0 && (
                  <ul className="cs-exp-achievements">
                    {exp.achievements.slice(0, 2).map((a, j) => <li key={j}>{a}</li>)}
                  </ul>
                )}
                <div className="cs-exp-tech">
                  {exp.technologies.slice(0, 8).map(tech => <span key={tech} className="cs-tech-tag">{tech}</span>)}
                  {exp.technologies.length > 8 && <span className="cs-tech-tag cs-tech-more">+{exp.technologies.length - 8}</span>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education" className="cs-section cs-education">
        <span className="cs-bignum">04</span>
        <div className="cs-container">
          <div className="cs-section-header">
            <span className="cs-tag cs-reveal">{t('education', 'eğitim')}.md</span>
            <h2 className="cs-section-title"><Split text={t('Education', 'Eğitim')} /></h2>
          </div>
          <div className="cs-edu-cards">
            {education.map(edu => (
              <div key={edu.id} className="cs-edu-card cs-glass cs-tilt cs-reveal">
                <div className="cs-edu-icon">🎓</div>
                <div className="cs-edu-body">
                  <h3 className="cs-edu-school">{edu.school}</h3>
                  <p className="cs-edu-degree">{edu.degree}</p>
                  <div className="cs-edu-meta">
                    <span>📅 {edu.duration}</span>
                    <span>📍 {edu.location}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                  <p className="cs-edu-desc">{edu.description}</p>
                  <div className="cs-edu-courses">
                    {edu.courses.map(c => <span key={c} className="cs-course-tag">{c}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="cs-section cs-testimonials">
        <span className="cs-bignum">05</span>
        <div className="cs-container">
          <div className="cs-section-header">
            <span className="cs-tag cs-reveal">{t('references', 'referanslar')}.txt</span>
            <h2 className="cs-section-title"><Split text={t('References', 'Referanslar')} /></h2>
          </div>
          <div className="cs-testimonials-grid">
            {testimonials.map(tm => (
              <div key={tm.id} className="cs-testimonial-card cs-glass cs-tilt cs-reveal">
                <span className="cs-quote-mark">"</span>
                <p className="cs-testimonial-text">{tm.text}</p>
                <div className="cs-testimonial-author">
                  <div className="cs-author-avatar">{tm.name[0]}</div>
                  <div>
                    <p className="cs-author-name">{tm.name}</p>
                    <p className="cs-author-role">{tm.position} · {tm.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="cs-section cs-contact">
        <span className="cs-bignum">06</span>
        <div className="cs-container">
          <div className="cs-section-header">
            <span className="cs-tag cs-reveal">{t('contact', 'iletişim')}.sh</span>
            <h2 className="cs-section-title"><Split text={t("Let's Connect", 'İletişime Geç')} /></h2>
          </div>
          <div className="cs-contact-inner cs-glass cs-reveal">
            <p className="cs-contact-desc">
              {t(
                "I'm open to new opportunities and collaborations. Feel free to reach out!",
                'Yeni fırsatlara ve iş birliklerine açığım. İletişime geçmekten çekinme!',
              )}
            </p>
            <a href={`mailto:${contact.email}`} className="cs-contact-email cs-contact-cta cs-magnetic">
              {contact.email}
            </a>
            <div className="cs-contact-socials">
              <a href={contact.social.github} target="_blank" rel="noopener noreferrer" className="cs-social-btn cs-social-github cs-magnetic">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a href={contact.social.linkedin} target="_blank" rel="noopener noreferrer" className="cs-social-btn cs-social-linkedin cs-magnetic">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
            <p className="cs-response-time">⚡ {contact.responseTime}</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="cs-footer">
        <div className="cs-footer-giant" aria-hidden="true">{personal.name.toUpperCase()} ✦ {personal.name.toUpperCase()}</div>
        <div className="cs-container">
          <p>
            {personal.name} · {new Date().getFullYear()}
            <span className="cs-footer-sep">·</span>
            <Link to="/" className="cs-footer-link">{t('Change Mode', 'Mod Değiştir')}</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
