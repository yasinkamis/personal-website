import { useId } from 'react';
import './Logo.css';

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

/**
 * Custom "YK" monogram — a clean rounded badge with a crisp gradient wordmark.
 * The gradient id is unique per instance (useId) so multiple logos on the same
 * page never clash and vanish. The frame draws itself in once on mount; hover
 * gives a subtle lift and gradient shimmer.
 */
export default function Logo({ size = 34, withWordmark = false, className = '' }: LogoProps) {
  const uid = useId().replace(/[:]/g, '');
  const grad = `yk-grad-${uid}`;

  return (
    <span className={`yk-logo ${className}`} aria-label="Yasin Kamış">
      <svg
        className="yk-logo-svg"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={grad} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="55%" stopColor="#7c9cff" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* badge */}
        <rect
          className="yk-badge"
          x="3" y="3" width="42" height="42" rx="12"
          fill={`url(#${grad})`} opacity="0.1"
        />
        <rect
          className="yk-frame"
          x="3.5" y="3.5" width="41" height="41" rx="11.5"
          stroke={`url(#${grad})`} strokeWidth="2.2"
        />

        {/* crisp monogram */}
        <text
          className="yk-text"
          x="24" y="25"
          textAnchor="middle" dominantBaseline="central"
          fill={`url(#${grad})`}
          fontFamily="'Inter','Segoe UI',system-ui,sans-serif"
          fontWeight="800" fontSize="20" letterSpacing="-0.5"
        >YK</text>
      </svg>
      {withWordmark && <span className="yk-wordmark">Yasin&nbsp;Kamış</span>}
    </span>
  );
}
