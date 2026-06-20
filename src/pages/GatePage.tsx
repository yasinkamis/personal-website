import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GatePage.css';

type Lang = 'en' | 'tr';

const BOOT_LINES = [
  { prefix: 'BOOT', text: 'System initializing...', suffix: null },
  { prefix: 'INFO', text: 'Loading portfolio assets', suffix: 'OK' },
  { prefix: 'INFO', text: 'Establishing connection', suffix: 'OK' },
  { prefix: 'SCAN', text: 'Detecting user capabilities...', suffix: null },
];

const TIMINGS = [200, 750, 1350, 1950];

const COPY = {
  en: {
    sectionLabel: 'ACCESS LEVEL DETECTION',
    question: 'Do you know how to use a terminal?',
    yes: 'YES',
    no: 'NO',
    yesMode: '→ Terminal Mode',
    noMode: '→ Classic Mode',
  },
  tr: {
    sectionLabel: 'ERİŞİM SEVİYESİ TESPİTİ',
    question: 'Terminal kullanmayı biliyor musun?',
    yes: 'EVET',
    no: 'HAYIR',
    yesMode: '→ Terminal Modu',
    noMode: '→ Klasik Mod',
  },
};

export default function GatePage() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('language') as Lang;
    return saved === 'en' || saved === 'tr' ? saved : 'en';
  });
  const [visibleCount, setVisibleCount] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();

  const c = COPY[lang];

  const toggleLang = () => {
    const next: Lang = lang === 'en' ? 'tr' : 'en';
    setLang(next);
    localStorage.setItem('language', next);
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    TIMINGS.forEach((delay, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          if (i === TIMINGS.length - 1) {
            timers.push(setTimeout(() => setShowQuestion(true), 650));
          }
        }, delay)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleChoice = (path: string) => {
    setLeaving(true);
    setTimeout(() => navigate(path), 650);
  };

  return (
    <div className={`gate-page ${leaving ? 'gate-leaving' : ''}`}>
      <div className="gate-bg-grid" />
      <div className="gate-orb gate-orb-1" />
      <div className="gate-orb gate-orb-2" />
      <div className="gate-scanlines" />

      {/* Language toggle — top right */}
      <button className="gate-lang-btn" onClick={toggleLang}>
        {lang === 'en' ? 'TR' : 'EN'}
      </button>

      <div className="gate-window">
        <div className="gate-window-header">
          <div className="gate-window-dots">
            <span className="gwdot gwdot-red" />
            <span className="gwdot gwdot-yellow" />
            <span className="gwdot gwdot-green" />
          </div>
          <span className="gate-window-title">gate@boot: ~</span>
          <div className="gate-window-spacer" />
        </div>

        <div className="gate-window-body">
          <div className="boot-sequence">
            {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
              <div key={i} className="boot-line">
                <span className={`boot-prefix boot-prefix-${line.prefix.toLowerCase()}`}>
                  [{line.prefix}]
                </span>
                <span className="boot-text">{line.text}</span>
                {line.suffix && (
                  <span className="boot-suffix">[&nbsp;{line.suffix}&nbsp;]</span>
                )}
              </div>
            ))}
            {!showQuestion && visibleCount < BOOT_LINES.length && (
              <span className="gate-cursor-blink">▋</span>
            )}
          </div>

          {showQuestion && (
            <div className="gate-question-area">
              <div className="gate-separator">
                <span className="gate-separator-label">{c.sectionLabel}</span>
              </div>

              <div className="gate-question-block">
                <p className="gq-main">{c.question}</p>
              </div>

              <div className="gate-choice-row">
                <button
                  className="gate-choice-btn gate-choice-yes"
                  onClick={() => handleChoice('/terminal')}
                >
                  <span className="gcb-main">{c.yes}</span>
                  <span className="gcb-sub">{c.yesMode}</span>
                </button>
                <button
                  className="gate-choice-btn gate-choice-no"
                  onClick={() => handleChoice('/classic')}
                >
                  <span className="gcb-main">{c.no}</span>
                  <span className="gcb-sub">{c.noMode}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
