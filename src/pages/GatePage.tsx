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
    question: 'Walk up to a gate',
    hintDesktop: 'WASD / arrows to walk · drag to look · click a gate or press E to enter',
    hintMobile: 'Joystick to walk · drag to look · tap a gate to enter',
    terminal: 'TERMINAL',
    classic: 'CLASSIC',
    yesMode: '→ Terminal Mode',
    noMode: '→ Classic Mode',
  },
  tr: {
    sectionLabel: 'ERİŞİM SEVİYESİ TESPİTİ',
    question: 'Bir kapıya yürü',
    hintDesktop: 'Yürümek için WASD / oklar · bakmak için sürükle · girmek için kapıya tıkla veya E',
    hintMobile: 'Yürümek için joystick · bakmak için sürükle · girmek için kapıya dokun',
    terminal: 'TERMINAL',
    classic: 'CLASSIC',
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
  const [active, setActive] = useState<GateKey | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<GateSceneApi | null>(null);

  const isTouch = useRef(typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
  const showQuestionRef = useRef(false);
  const choiceRef = useRef<(k: GateKey) => void>(() => {});
  const langRef = useRef<Lang>(lang);
  langRef.current = lang;

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
          lang: langRef.current,
          onHover: k => { setActive(k); if (k === 'classic') void import('./ClassicSite'); },
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
    sceneRef.current?.setLang(next);
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

  useEffect(() => {
    showQuestionRef.current = showQuestion;
    if (showQuestion) sceneRef.current?.setReady(true);
  }, [showQuestion]);

  /* ── mobile joystick ── */
  const joyBaseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0, active: false });
  const joyId = useRef<number | null>(null);

  const joyFromEvent = (e: React.PointerEvent) => {
    const base = joyBaseRef.current;
    if (!base) return;
    const r = base.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const max = r.width / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const len = Math.hypot(dx, dy);
    if (len > max) { dx = (dx / len) * max; dy = (dy / len) * max; }
    setKnob({ x: dx, y: dy, active: true });
    sceneRef.current?.setMoveVector(dx / max, -dy / max);
  };
  const joyStart = (e: React.PointerEvent) => {
    joyId.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    joyFromEvent(e);
  };
  const joyMove = (e: React.PointerEvent) => { if (joyId.current === e.pointerId) joyFromEvent(e); };
  const joyEnd = (e: React.PointerEvent) => {
    if (joyId.current !== e.pointerId) return;
    joyId.current = null;
    setKnob({ x: 0, y: 0, active: false });
    sceneRef.current?.setMoveVector(0, 0);
  };

  return (
    <div className={`gate-page ${leaving ? 'gate-leaving' : ''}`}>
      <canvas ref={canvasRef} className="gate-canvas" />
      <div className="gate-scanlines" />

      {/* Language toggle — top right */}
      <button className="gate-lang-btn" onClick={toggleLang}>
        {lang === 'en' ? 'TR' : 'EN'}
      </button>

      {/* Mobile: menu button (top-left) → selection modal */}
      {showQuestion && (
        <button className="gate-menu-btn" onClick={() => setMenuOpen(true)}>
          ☰ {lang === 'tr' ? 'Seç' : 'Menu'}
        </button>
      )}
      {menuOpen && (
        <div className="gate-modal-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="gate-modal" onClick={e => e.stopPropagation()}>
            <span className="gate-modal-label">{c.question}</span>
            <button className="gate-modal-btn gate-modal-terminal" onClick={() => { setMenuOpen(false); handleChoice('/terminal'); }}>
              <span>TERMINAL</span><small>{c.yesMode}</small>
            </button>
            <button className="gate-modal-btn gate-modal-classic" onClick={() => { setMenuOpen(false); handleChoice('/classic'); }}>
              <span>CLASSIC</span><small>{c.noMode}</small>
            </button>
            <button className="gate-modal-close" onClick={() => setMenuOpen(false)}>✕</button>
          </div>
        </div>
      )}

      {/* Boot window — fades out once the hall appears */}
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
                <span className={`boot-prefix boot-prefix-${line.prefix.toLowerCase()}`}>[{line.prefix}]</span>
                <span className="boot-text">{line.text}</span>
                {line.suffix && <span className="boot-suffix">[&nbsp;{line.suffix}&nbsp;]</span>}
              </div>
            ))}
            {visibleCount < BOOT_LINES.length && <span className="gate-cursor-blink">▋</span>}
          </div>
        </div>
      </div>

      {/* Walkable 3D HUD */}
      {showQuestion && (
        <div className="gate-hud">
          <div className="gate-hud-top">
            <span className="gate-separator-label">{c.sectionLabel}</span>
            <h1 className="gate-hud-title">{c.question}</h1>
            <p className="gate-hud-hint">{isTouch.current ? c.hintMobile : c.hintDesktop}</p>
          </div>

          {!isTouch.current && <div className="gate-crosshair" />}

          {active && !leaving && (
            <div className={`gate-enter-prompt gate-enter-${active}`}>
              <span className="gep-key">
                {isTouch.current ? (lang === 'tr' ? 'DOKUN' : 'TAP') : (lang === 'tr' ? 'TIKLA / E' : 'CLICK / E')}
              </span>
              <span className="gep-text">
                {lang === 'tr'
                  ? `${active === 'terminal' ? 'TERMINAL' : 'CLASSIC'} moduna gir →`
                  : `Enter ${active === 'terminal' ? 'TERMINAL' : 'CLASSIC'} →`}
              </span>
            </div>
          )}

          {/* mobile joystick */}
          {isTouch.current && (
            <div
              className="gate-joystick"
              ref={joyBaseRef}
              onPointerDown={joyStart}
              onPointerMove={joyMove}
              onPointerUp={joyEnd}
              onPointerCancel={joyEnd}
            >
              <div
                className={`gate-joystick-knob ${knob.active ? 'active' : ''}`}
                style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
              />
            </div>
          )}

          {/* quick-enter fallback buttons */}
          <div className="gate-choice-row">
            <button
              className="gate-choice-btn gate-choice-yes"
              onClick={() => handleChoice('/terminal')}
              onMouseEnter={() => sceneRef.current?.hoverPortal('terminal')}
              onMouseLeave={() => sceneRef.current?.hoverPortal(null)}
            >
              <span className="gcb-main">{c.terminal}</span>
              <span className="gcb-sub">{c.yesMode}</span>
            </button>
            <button
              className="gate-choice-btn gate-choice-no"
              onClick={() => handleChoice('/classic')}
              onMouseEnter={() => { sceneRef.current?.hoverPortal('classic'); void import('./ClassicSite'); }}
              onMouseLeave={() => sceneRef.current?.hoverPortal(null)}
            >
              <span className="gcb-main">{c.classic}</span>
              <span className="gcb-sub">{c.noMode}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
