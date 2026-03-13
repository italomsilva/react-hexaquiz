/**
 * Design system for Hexaquiz.
 * Centralizes colors and other patterns used throughout the application.
 */

export const COLORS = {
  // Brand colors
  primary: '#CCFF00',
  background: '#0A0A0A',
  foreground: '#FFFFFF',
  
  // Surface colors (Shades of dark gray for cards, sections, etc.)
  surface: {
    base: '#111111',     // Slightly lighter than background
    elevated: '#1A1A1A', // For hover states or higher elevation
    overlay: '#222222',  // For very specific overlays
  },

  // Borders
  border: {
    subtle: '#222222',
    standard: '#333333',
    neon: 'rgba(204, 255, 0, 0.3)',
  },

  // States and accents
  gray: {
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  error: '#FF4444',
  success: '#00C851',
  warning: '#FFBB33',
} as const;

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

export const BORDER_RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const THEME = {
  colors: COLORS,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  fontFamily: {
    inter: 'var(--font-inter), sans-serif',
  },
} as const;

export default THEME;
