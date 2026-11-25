import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'og-image.png');

const W = 1200, H = 630;

const tags = ['React', 'Next.js', 'Vite', 'TypeScript', 'Three.js'];
// layout the tag pills
let tx = 90;
const tagSvg = tags.map(t => {
  const w = 34 + t.length * 15.5;
  const el = `
    <g transform="translate(${tx},${tx === 90 ? 0 : 0})">
      <rect x="0" y="470" width="${w}" height="46" rx="23" fill="rgba(94,234,212,0.08)" stroke="rgba(94,234,212,0.28)"/>
      <text x="${w / 2}" y="499" text-anchor="middle" font-family="'Segoe UI',Arial,sans-serif" font-size="22" font-weight="600" fill="#9fe9da">${t}</text>
    </g>`;
  tx += w + 16;
  return el;
}).join('');

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="acc" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#5eead4"/>
      <stop offset="52%" stop-color="#7c9cff"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
    <radialGradient id="g1" cx="85%" cy="12%" r="60%">
      <stop offset="0%" stop-color="rgba(124,156,255,0.26)"/>
      <stop offset="100%" stop-color="rgba(124,156,255,0)"/>
    </radialGradient>
    <radialGradient id="g2" cx="6%" cy="96%" r="55%">
      <stop offset="0%" stop-color="rgba(94,234,212,0.18)"/>
      <stop offset="100%" stop-color="rgba(94,234,212,0)"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="rgba(120,160,220,0.06)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="#02050b"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>
  <rect x="0" y="0" width="${W}" height="6" fill="url(#acc)"/>

  <!-- left content -->
  <text x="90" y="150" font-family="'Consolas','Segoe UI',monospace" font-size="26" font-weight="700" letter-spacing="6" fill="#5eead4">FRONTEND DEVELOPER</text>
  <text x="86" y="270" font-family="'Segoe UI',Arial,sans-serif" font-size="104" font-weight="800" letter-spacing="-2" fill="#ffffff">Yasin Kamış</text>
  <text x="90" y="345" font-family="'Segoe UI',Arial,sans-serif" font-size="36" font-weight="500" fill="#aab6cc">Scalable, fast, accessible interfaces</text>
  <text x="90" y="398" font-family="'Consolas','Segoe UI',monospace" font-size="30" font-weight="600" fill="#7c9cff">React · Next.js · Vite · TypeScript</text>

  ${tagSvg}

  <text x="90" y="575" font-family="'Consolas','Segoe UI',monospace" font-size="30" font-weight="700" fill="url(#acc)">yasinkamis.com</text>

  <!-- right: YK badge -->
  <g transform="translate(985,315)">
    <circle cx="0" cy="0" r="170" fill="none" stroke="rgba(124,156,255,0.16)" stroke-width="2"/>
    <circle cx="0" cy="0" r="205" fill="none" stroke="rgba(94,234,212,0.1)" stroke-width="2" stroke-dasharray="8 10"/>
    <rect x="-95" y="-95" width="190" height="190" rx="42" fill="rgba(8,14,26,0.6)" stroke="url(#acc)" stroke-width="5"/>
    <text x="0" y="8" text-anchor="middle" dominant-baseline="middle" font-family="'Segoe UI',Arial,sans-serif" font-size="110" font-weight="800" letter-spacing="-3" fill="url(#acc)">YK</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('wrote', out);
