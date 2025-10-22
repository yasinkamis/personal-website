// Uzay temalı renk paleti ve tema ayarları
export const spaceTheme = {
  colors: {
    // Ana renkler - Mor ve Siyah tonları
    primary: '#9333EA',        // Parlak mor
    primaryDark: '#6B21A8',    // Koyu mor
    primaryLight: '#C084FC',   // Açık mor

    // Arka plan renkleri
    background: '#0A0A0F',     // Uzay siyahı
    backgroundAlt: '#13131A',  // Hafif açık siyah

    // Vurgu renkleri
    accent: '#EC4899',         // Pembe (nebula)
    accentBlue: '#3B82F6',     // Mavi (yıldız)
    accentPurple: '#A855F7',   // Mor (galaksi)

    // Metin renkleri
    text: '#F9FAFB',           // Beyaz
    textSecondary: '#D1D5DB',  // Gri-beyaz
    textMuted: '#9CA3AF',      // Soluk gri

    // Özel renkler
    glow: '#E879F9',           // Parlama efekti
    starLight: '#FDE68A',      // Yıldız ışığı
    nebula: '#C026D3',         // Nebula mor
  },

  gradients: {
    primary: 'linear-gradient(135deg, #9333EA 0%, #C026D3 100%)',
    cosmic: 'linear-gradient(135deg, #0A0A0F 0%, #1E1B4B 50%, #312E81 100%)',
    nebula: 'linear-gradient(135deg, #9333EA 0%, #EC4899 50%, #3B82F6 100%)',
    glow: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
  },

  shadows: {
    glow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)',
    glowStrong: '0 0 30px rgba(147, 51, 234, 0.8), 0 0 60px rgba(147, 51, 234, 0.5)',
    card: '0 8px 32px rgba(0, 0, 0, 0.6)',
    cardHover: '0 12px 48px rgba(147, 51, 234, 0.4)',
  },

  animations: {
    // Animasyon süreleri
    fast: '0.2s',
    normal: '0.4s',
    slow: '0.6s',
    verySlow: '1s',

    // Easing fonksiyonları
    easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
    easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },

  borderRadius: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    full: '9999px',
  },

  fonts: {
    primary: "'Inter', 'Segoe UI', sans-serif",
    display: "'Orbitron', 'Space Grotesk', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },

  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },

  zIndex: {
    background: -10,
    normal: 0,
    navigation: 1000,
    modal: 2000,
    tooltip: 3000,
  },
};

export default spaceTheme;
