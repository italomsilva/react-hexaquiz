/**
 * Design system for Hexaquiz.
 * Centralizes colors and other patterns used throughout the application.
 */

export const COLORS = {
  primary: {
    DEFAULT: 'var(--color-primary)',
    light: 'var(--color-primary-light)',
    dark: 'var(--color-primary-dark)',
    hover: 'var(--color-primary-hover)',
  },
  secondary: {
    DEFAULT: 'var(--color-secondary)',
    hover: 'var(--color-secondary-hover)',
  },
  background: 'var(--color-background)',
  foreground: 'var(--color-foreground)',
  surface: {
    base: 'var(--color-surface)',
    elevated: 'var(--color-surface-elevated)',
  },
  border: {
    subtle: 'var(--color-border-subtle)',
    standard: 'var(--color-border-standard)',
  },
  error: 'var(--color-error)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
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
