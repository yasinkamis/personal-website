import type { ReactElement, SVGProps } from 'react';

/* Hand-drawn icon set (24x24, stroke = currentColor). No emoji anywhere. */
const PATHS: Record<string, ReactElement> = {
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></>,
  'mail-open': <><path d="M3.5 10 12 4l8.5 6v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V10z" /><path d="m4 10.5 8 5.5 8-5.5" /></>,
  inbox: <><path d="M3.5 13.5 6 5.5h12l2.5 8" /><path d="M3.5 13.5V18a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-4.5h-5.5a3 3 0 0 1-6 0H3.5z" /></>,
  dot: <><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="8.5" /></>,
  cap: <><path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5z" /><path d="M6.5 12v4.2c0 1.2 2.5 2.8 5.5 2.8s5.5-1.6 5.5-2.8V12" /><path d="M21.5 9.5V15" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  bolt: <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8z" />,
  briefcase: <><rect x="3" y="7.5" width="18" height="12.5" rx="2.5" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 13h18" /></>,
  rocket: <><path d="M14.5 3.5c3.5.3 6 2.8 6 6-2 4-5 6.5-9 8l-4.5-4.5c1.5-4 4-7 7.5-9.5z" /><circle cx="14.8" cy="9.2" r="1.6" /><path d="M6.5 14.5c-1.8.3-2.8 1.6-3 4 2.4-.2 3.7-1.2 4-3" /></>,
  list: <><rect x="5" y="4" width="14" height="17" rx="2.5" /><path d="M9 10h6M9 14h6M9 18h3" /></>,
  gamepad: <><rect x="2.5" y="7" width="19" height="11" rx="5" /><path d="M7.5 10.5v4M5.5 12.5h4" /><circle cx="15.5" cy="11.5" r=".9" fill="currentColor" /><circle cx="18" cy="13.5" r=".9" fill="currentColor" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  unlock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 7.5-2" /></>,
  chart: <><path d="M4 20V4M4 20h16" /><rect x="7.5" y="12" width="3" height="5.5" rx=".8" /><rect x="12.5" y="8" width="3" height="9.5" rx=".8" /><rect x="17" y="14" width="2.5" height="3.5" rx=".8" /></>,
  users: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5" /><circle cx="17" cy="9.5" r="2.4" /><path d="M17.5 14.7c2 .3 3.2 2 3.5 4.3" /></>,
  chat: <path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-5 3.5V17.5H4A1.5 1.5 0 0 1 2.5 16V7A1.5 1.5 0 0 1 4 5.5z" />,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />,
  keyboard: <><rect x="2.5" y="6" width="19" height="12" rx="2.5" /><path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M7 14h10" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" /></>,
  coffee: <><path d="M4.5 9h12v6a4.5 4.5 0 0 1-4.5 4.5h-3A4.5 4.5 0 0 1 4.5 15V9z" /><path d="M16.5 10.5h1.5a2.5 2.5 0 0 1 0 5h-1.5M8 3.5c-.8 1-.8 2 0 3M12 3.5c-.8 1-.8 2 0 3" /></>,
  alert: <><path d="M12 3.5 2.8 19.5h18.4L12 3.5z" /><path d="M12 10v4.2M12 17h.01" /></>,
  flame: <path d="M12 21c-4 0-6.5-2.7-6.5-6.2 0-3.2 2.5-5 3.5-8 .5-1.4.3-2.6.2-3.3 3.3 1.4 5.8 4.4 6.3 7.3.7-.7 1-1.8.9-3 2 1.8 3.1 4.2 3.1 6.6 0 3.5-3 6.6-7.5 6.6z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  hourglass: <path d="M6.5 3.5h11M6.5 20.5h11M7.5 3.5c0 4.5 4.5 5.5 4.5 8.5s-4.5 4-4.5 8.5M16.5 3.5c0 4.5-4.5 5.5-4.5 8.5s4.5 4 4.5 8.5" />,
  send: <path d="M21 3.5 10.5 14M21 3.5l-6.8 17-3.7-6.5L4 10.3 21 3.5z" />,
  crystal: <><circle cx="12" cy="10.5" r="7" /><path d="M6.5 19.5h11l-1-3.2h-9l-1 3.2zM8.5 8a4 4 0 0 1 3-2.3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></>,
  arrow: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  sparkle: <path d="M12 2.5c.7 5 2.2 7.3 9.5 9.5-7.3 2.2-8.8 4.5-9.5 9.5-.7-5-2.2-7.3-9.5-9.5 7.3-2.2 8.8-4.5 9.5-9.5z" fill="currentColor" stroke="none" />,
  github: <path fill="currentColor" stroke="none" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />,
  linkedin: <path fill="currentColor" stroke="none" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />,
};

export type IconName = keyof typeof PATHS;

export default function Icon({ name, ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="ic"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
