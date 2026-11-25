import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GateKey } from '../three/GateScene';
type GateSceneApi = Awaited<ReturnType<typeof import('../three/GateScene')['createGateScene']>>;
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
    question: 'Choose your gate',
    hint: 'Move your mouse to look around · click a gate to enter',
    yes: 'TERMINAL',
    no: 'CLASSIC',
    yesMode: '→ Terminal Mode',
    noMode: '→ Classic Mode',
  },
  tr: {
    sectionLabel: 'ERİŞİM SEVİYESİ TESPİTİ',
    question: 'Kapını seç',
    hint: 'Etrafına bakmak için fareni oynat · girmek için bir kapıya tıkla',
    yes: 'TERMINAL',
    no: 'CLASSIC',
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<GateSceneApi | null>(null);

  // keep latest state available to the (once-created) scene callbacks
  const showQuestionRef = useRef(false);
  const choiceRef = useRef<(k: GateKey) => void>(() => {});

  const handleChoice = (path: string) => {
    if (leaving) return;
    setLeaving(true);
    sceneRef.current?.warp();
    setTimeout(() => navigate(path), 900);
  };
  choiceRef.current = (k: GateKey) => handleChoice(k === 'terminal' ? '/terminal' : '/classic');

  useEffect(() => {
    if (!canvasRef.current) return;
    let cancelled = false;
    let disposeFn: (() => void) | null = null;
    const canvas = canvasRef.current;
    import('../three/GateScene').then(({ createGateScene }) => {
      if (cancelled) return;
      try {
        const sc = createGateScene(canvas, {
          onHover: k => {
            sc.setMood(k ?? 'idle');
            if (k === 'classic') void import('./ClassicSite');
          },
          onSelect: k => choiceRef.current(k),
        });
        sceneRef.current = sc;
        disposeFn = sc.dispose;
        if (showQuestionRef.current) sc.setReady(true);
      } catch {
        canvas.style.display = 'none';
      }
    });
    return () => { cancelled = true; disposeFn?.(); sceneRef.current = null; };
  }, []);

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

  // reveal the 3D portals once the boot sequence finishes
  useEffect(() => {
    showQuestionRef.current = showQuestion;
    if (showQuestion) sceneRef.current?.setReady(true);
  }, [showQuestion]);

  return (
    <div className={`gate-page ${leaving ? 'gate-leaving' : ''}`}>
      <canvas ref={canvasRef} className="gate-canvas" />
      <div className="gate-bg-grid" />
      <div className="gate-orb gate-orb-1" />
      <div className="gate-orb gate-orb-2" />
      <div className="gate-scanlines" />

      {/* Language toggle — top right */}
      <button className="gate-lang-btn" onClick={toggleLang}>
        {lang === 'en' ? 'TR' : 'EN'}
      </button>

      {/* Boot window — fades out once the gates appear */}
      <div className={`gate-window ${showQuestion ? 'gate-window-dismiss' : ''}`}>
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
            {visibleCount < BOOT_LINES.length && <span className="gate-cursor-blink">▋</span>}
          </div>
        </div>
      </div>

      {/* 3D gate selection HUD */}
      {showQuestion && (
        <div className="gate-hud">
          <div className="gate-hud-top">
            <span className="gate-separator-label">{c.sectionLabel}</span>
            <h1 className="gate-hud-title">{c.question}</h1>
          </div>

          <div className="gate-hud-bottom">
            <p className="gate-hud-hint">{c.hint}</p>

            {/* accessible / mobile fallback buttons — mirror the 3D gates */}
            <div className="gate-choice-row">
              <button
                className="gate-choice-btn gate-choice-yes"
                onClick={() => handleChoice('/terminal')}
                onMouseEnter={() => sceneRef.current?.hoverPortal('terminal')}
                onMouseLeave={() => sceneRef.current?.hoverPortal(null)}
              >
                <span className="gcb-main">{c.yes}</span>
                <span className="gcb-sub">{c.yesMode}</span>
              </button>
              <button
                className="gate-choice-btn gate-choice-no"
                onClick={() => handleChoice('/classic')}
                onMouseEnter={() => { sceneRef.current?.hoverPortal('classic'); void import('./ClassicSite'); }}
                onMouseLeave={() => sceneRef.current?.hoverPortal(null)}
              >
                <span className="gcb-main">{c.no}</span>
                <span className="gcb-sub">{c.noMode}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
