import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GatePage.css';

const BOOT_LINES = [
  { prefix: 'BOOT', text: 'System initializing...', suffix: null },
  { prefix: 'INFO', text: 'Loading portfolio assets', suffix: 'OK' },
  { prefix: 'INFO', text: 'Establishing connection', suffix: 'OK' },
  { prefix: 'SCAN', text: 'Detecting user capabilities...', suffix: null },
];

const TIMINGS = [200, 750, 1350, 1950];

export default function GatePage() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();

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
                <span className="gate-separator-label">ACCESS LEVEL DETECTION</span>
              </div>

              <div className="gate-question-block">
                <p className="gq-tr">Terminal kullanmayı biliyor musun?</p>
                <p className="gq-en">Do you know how to use a terminal?</p>
              </div>

              <div className="gate-choice-row">
                <button
                  className="gate-choice-btn gate-choice-yes"
                  onClick={() => handleChoice('/terminal')}
                >
                  <span className="gcb-main">YES / EVET</span>
                  <span className="gcb-sub">→ Terminal Mode</span>
                </button>
                <button
                  className="gate-choice-btn gate-choice-no"
                  onClick={() => handleChoice('/classic')}
                >
                  <span className="gcb-main">NO / HAYIR</span>
                  <span className="gcb-sub">→ Classic Mode</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
