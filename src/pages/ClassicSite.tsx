import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import './ClassicSite.css';

/* ── Skill categories ── */
const SKILL_CATS: { label: string; labelTr: string; skills: string[]; color: string }[] = [
  {
    label: 'Frontend',
    labelTr: 'Frontend',
    color: 'blue',
    skills: ['React', 'Next.js', 'Vite.js', 'JavaScript', 'TypeScript', 'Redux', 'Zustand', 'React Query', 'styled-components', 'MUI', 'Ant Design', 'Tailwind', 'Bootstrap', 'SCSS', 'CSS3', 'HTML5', 'Framer Motion'],
  },
  {
    label: 'Backend & API',
    labelTr: 'Backend & API',
    color: 'green',
    skills: ['Java', 'Spring Boot', 'Spring MVC', 'Node.js', 'GraphQL', 'REST'],
  },
  {
    label: 'DevOps & Tools',
    labelTr: 'DevOps & Araçlar',
    color: 'orange',
    skills: ['Docker', 'Jenkins', 'Git', 'Webpack', 'Vite', 'Eslint', 'Jira'],
  },
  {
    label: 'Design',
    labelTr: 'Tasarım',
    color: 'purple',
    skills: ['Figma', 'Photoshop', 'Illustrator', 'Adobe XD'],
  },
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

    const tick = () => {
      if (cancelled) return;
      const current = texts[textIdx % texts.length];
      if (!deleting) {
        if (charIdx < current.length) {
          charIdx++;
          setDisplay(current.slice(0, charIdx));
          setTimeout(tick, 100);
        } else {
          setTimeout(() => { deleting = true; setTimeout(tick, 50); }, 2200);
        }
      } else {
        if (charIdx > 0) {
          charIdx--;
          setDisplay(current.slice(0, charIdx));
          setTimeout(tick, 45);
        } else {
          deleting = false;
          textIdx++;
          setTimeout(tick, 300);
        }
      }
    };

    const init = setTimeout(tick, 400);
    return () => { cancelled = true; clearTimeout(init); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textsKey]);

  return display;
}

/* ── Intersection reveal hook ── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('cs-revealed'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.cs-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Counter hook ── */
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(ease * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ── Nav links config ── */
const NAV_LINKS = [
  { href: '#about',        label: 'About',        labelTr: 'Hakkımda' },
  { href: '#skills',       label: 'Skills',        labelTr: 'Yetenekler' },
  { href: '#experience',   label: 'Experience',    labelTr: 'Deneyim' },
  { href: '#education',    label: 'Education',     labelTr: 'Eğitim' },
  { href: '#testimonials', label: 'References',    labelTr: 'Referanslar' },
  { href: '#contact',      label: 'Contact',       labelTr: 'İletişim' },
];

/* ════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════ */
export default function ClassicSite() {
  const { data } = useData();
  const { language, setLanguage } = useLanguage();
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  const t = (en: string, tr: string) => language === 'tr' ? tr : en;

  const typeTitles = useMemo(() => (
    language === 'tr'
      ? ['Frontend Geliştirici', 'Takım Lideri', 'UI/UX Tutkunu']
      : ['Frontend Developer', 'Team Lead', 'UI/UX Enthusiast']
  ), [language]);

  const typed = useTypewriter(typeTitles);
  useReveal();

  const yearsCounter = useCounter(data?.overview.yearsOfExperience ?? 4);
  const projectsCounter = useCounter(data?.overview.projectsCompleted ?? 20);

  /* Scroll-based nav state */
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Active section tracker */
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Smooth scroll handler */
  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!data) {
    return (
      <div className="cs-loading">
        <div className="cs-loading-dot" /><div className="cs-loading-dot" /><div className="cs-loading-dot" />
      </div>
    );
  }

  const { personal, overview, workExperience, testimonials, education, contact } = data;

  return (
    <div className="classic-site">

      {/* ── NAVBAR ── */}
      <nav className={`cs-nav ${navScrolled ? 'cs-nav-scrolled' : ''}`}>
        <div className="cs-nav-inner">
          <a href="#hero" className="cs-logo" onClick={e => { e.preventDefault(); scrollTo('#hero'); }}>
            <span className="cs-logo-bracket">&lt;</span>
            YK
            <span className="cs-logo-bracket">/&gt;</span>
          </a>

          <ul className="cs-nav-links cs-nav-links-desktop">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`cs-nav-link ${activeSection === link.href.slice(1) ? 'cs-nav-link-active' : ''}`}
                  onClick={e => { e.preventDefault(); scrollTo(link.href); }}
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
            <Link to="/terminal" className="cs-terminal-btn">
              <span className="cs-terminal-btn-icon">$_</span>
              {t('Terminal', 'Terminal')}
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

      {/* ── MOBILE MENU OVERLAY (outside nav to avoid backdrop-filter containing block bug) ── */}
      <ul className={`cs-nav-links cs-nav-links-mobile ${menuOpen ? 'cs-nav-links-open' : ''}`}>
        {NAV_LINKS.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              className={`cs-nav-link ${activeSection === link.href.slice(1) ? 'cs-nav-link-active' : ''}`}
              onClick={e => { e.preventDefault(); scrollTo(link.href); }}
            >
              {t(link.label, link.labelTr)}
            </a>
          </li>
        ))}
      </ul>

      {/* ── HERO ── */}
      <section id="hero" className="cs-hero">
        <div className="cs-hero-bg">
          <div className="cs-hero-grid" />
          <div className="cs-hero-orb cs-hero-orb-1" />
          <div className="cs-hero-orb cs-hero-orb-2" />
          <div className="cs-hero-orb cs-hero-orb-3" />
        </div>
        <div className="cs-hero-content">
          <p className="cs-hero-greeting">{overview.greeting} <span className="cs-hero-wave">👋</span></p>
          <h1 className="cs-hero-name">{personal.name.toUpperCase()}</h1>
          <div className="cs-hero-title-row">
            <span className="cs-hero-cursor-bracket">&gt;</span>
            <span className="cs-hero-typed">{typed}</span>
            <span className="cs-hero-caret" />
          </div>
          <p className="cs-hero-bio">{personal.bio.slice(0, 180)}…</p>
          <div className="cs-hero-ctas">
            <a href="#contact" className="cs-btn cs-btn-primary" onClick={e => { e.preventDefault(); scrollTo('#contact'); }}>
              {t('Contact Me', 'İletişime Geç')}
            </a>
            <a
              href={contact.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cs-btn cs-btn-ghost"
            >
              GitHub
            </a>
          </div>
          <div className="cs-hero-stats">
            <div className="cs-hero-stat">
              <span ref={yearsCounter.ref} className="cs-hero-stat-val">{yearsCounter.count}+</span>
              <span className="cs-hero-stat-label">{t('Years Experience', 'Yıl Deneyim')}</span>
            </div>
            <div className="cs-hero-stat-divider" />
            <div className="cs-hero-stat">
              <span ref={projectsCounter.ref} className="cs-hero-stat-val">{projectsCounter.count}+</span>
              <span className="cs-hero-stat-label">{t('Projects Completed', 'Tamamlanan Proje')}</span>
            </div>
          </div>
        </div>
        <a href="#about" className="cs-hero-scroll" onClick={e => { e.preventDefault(); scrollTo('#about'); }}>
          <span className="cs-hero-scroll-dot" />
        </a>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="cs-section cs-about">
        <div className="cs-container">
          <div className="cs-section-header cs-reveal">
            <span className="cs-tag">{t('about', 'hakkımda')}.ts</span>
            <h2 className="cs-section-title">{t('About Me', 'Hakkımda')}</h2>
          </div>
          <div className="cs-about-grid">
            <div className="cs-about-bio cs-reveal">
              <p>{personal.bio}</p>
              <div className="cs-about-meta">
                <div className="cs-meta-item">
                  <span className="cs-meta-icon">📍</span>
                  <span>{personal.location}</span>
                </div>
                <div className="cs-meta-item">
                  <span className="cs-meta-icon">✉️</span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
                <div className="cs-meta-item">
                  <span className="cs-meta-icon">🟢</span>
                  <span>{contact.availability}</span>
                </div>
              </div>
            </div>
            <div className="cs-about-cards">
              {[
                { val: `${overview.yearsOfExperience}+`, label: t('Years of Experience', 'Yıl Deneyim'), color: 'blue' },
                { val: `${overview.projectsCompleted}+`, label: t('Projects Completed', 'Tamamlanan Proje'), color: 'green' },
                { val: personal.skills.length.toString(), label: t('Technologies', 'Teknoloji'), color: 'purple' },
                { val: workExperience.length.toString(), label: t('Companies', 'Şirket'), color: 'orange' },
              ].map((card, i) => (
                <div key={i} className={`cs-stat-card cs-stat-card-${card.color} cs-reveal`} style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="cs-stat-card-val">{card.val}</span>
                  <span className="cs-stat-card-label">{card.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="cs-section cs-skills cs-section-alt">
        <div className="cs-container">
          <div className="cs-section-header cs-reveal">
            <span className="cs-tag">{t('skills', 'yetenekler')}.json</span>
            <h2 className="cs-section-title">{t('Technical Skills', 'Teknik Yetenekler')}</h2>
          </div>
          <div className="cs-skills-grid">
            {SKILL_CATS.map((cat, ci) => (
              <div key={ci} className={`cs-skill-cat cs-reveal`} style={{ transitionDelay: `${ci * 100}ms` }}>
                <h3 className={`cs-skill-cat-title cs-skill-cat-title-${cat.color}`}>
                  {language === 'tr' ? cat.labelTr : cat.label}
                </h3>
                <div className="cs-skill-tags">
                  {cat.skills.map(skill => (
                    <span key={skill} className={`cs-skill-tag cs-skill-tag-${cat.color}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="cs-section cs-experience">
        <div className="cs-container">
          <div className="cs-section-header cs-reveal">
            <span className="cs-tag">{t('experience', 'deneyim')}.log</span>
            <h2 className="cs-section-title">{t('Work Experience', 'İş Deneyimi')}</h2>
          </div>
          <div className="cs-timeline">
            {workExperience.map((exp, i) => (
              <div key={exp.id} className="cs-timeline-item cs-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="cs-timeline-dot" />
                <div className="cs-exp-card">
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
                      {exp.achievements.slice(0, 2).map((a, j) => (
                        <li key={j}>{a}</li>
                      ))}
                    </ul>
                  )}
                  <div className="cs-exp-tech">
                    {exp.technologies.slice(0, 8).map(tech => (
                      <span key={tech} className="cs-tech-tag">{tech}</span>
                    ))}
                    {exp.technologies.length > 8 && (
                      <span className="cs-tech-tag cs-tech-more">+{exp.technologies.length - 8}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education" className="cs-section cs-education cs-section-alt">
        <div className="cs-container">
          <div className="cs-section-header cs-reveal">
            <span className="cs-tag">{t('education', 'eğitim')}.md</span>
            <h2 className="cs-section-title">{t('Education', 'Eğitim')}</h2>
          </div>
          <div className="cs-edu-cards">
            {education.map((edu, i) => (
              <div key={edu.id} className="cs-edu-card cs-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
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
                    {edu.courses.map(c => (
                      <span key={c} className="cs-course-tag">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="cs-section cs-testimonials">
        <div className="cs-container">
          <div className="cs-section-header cs-reveal">
            <span className="cs-tag">{t('references', 'referanslar')}.txt</span>
            <h2 className="cs-section-title">{t('References', 'Referanslar')}</h2>
          </div>
          <div className="cs-testimonials-grid">
            {testimonials.map((t2, i) => (
              <div key={t2.id} className="cs-testimonial-card cs-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="cs-quote-mark">"</span>
                <p className="cs-testimonial-text">{t2.text}</p>
                <div className="cs-testimonial-author">
                  <div className="cs-author-avatar">{t2.name[0]}</div>
                  <div>
                    <p className="cs-author-name">{t2.name}</p>
                    <p className="cs-author-role">{t2.position} · {t2.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="cs-section cs-contact cs-section-alt">
        <div className="cs-container">
          <div className="cs-section-header cs-reveal">
            <span className="cs-tag">{t('contact', 'iletişim')}.sh</span>
            <h2 className="cs-section-title">{t("Let's Connect", 'İletişime Geç')}</h2>
          </div>
          <div className="cs-contact-inner cs-reveal">
            <p className="cs-contact-desc">
              {t(
                "I'm open to new opportunities and collaborations. Feel free to reach out!",
                'Yeni fırsatlara ve iş birliklerine açığım. İletişime geçmekten çekinme!'
              )}
            </p>
            <a href={`mailto:${contact.email}`} className="cs-contact-email">
              {contact.email}
            </a>
            <div className="cs-contact-socials">
              <a href={contact.social.github} target="_blank" rel="noopener noreferrer" className="cs-social-btn cs-social-github">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a href={contact.social.linkedin} target="_blank" rel="noopener noreferrer" className="cs-social-btn cs-social-linkedin">
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
