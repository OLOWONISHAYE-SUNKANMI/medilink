export const Colors = {
  // Primary brand - deep medical blue
  primary: '#1A6FE8',
  primaryLight: '#4A93FF',
  primaryDark: '#0D4DB0',
  primaryGhost: 'rgba(26, 111, 232, 0.12)',

  // Accent - teal/mint for health
  accent: '#00C9A7',
  accentLight: '#4DDDCA',
  accentDark: '#009E83',
  accentGhost: 'rgba(0, 201, 167, 0.12)',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',

  // Neutrals - dark mode
  background: '#0C0F1E',
  surface: '#141829',
  surfaceElevated: '#1C2235',
  surfaceHighlight: '#242B42',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.16)',

  // Text
  textPrimary: '#F0F4FF',
  textSecondary: '#8892AC',
  textMuted: '#5A6480',
  white: '#FFFFFF',
  black: '#000000',

  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#1A6FE8', '#00C9A7'] as const,
  gradientCard: ['#1C2235', '#141829'] as const,
  gradientHero: ['#0D1530', '#141829'] as const,
};

export const Typography = {
  heading1: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.5 },
  heading2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3 },
  heading3: { fontSize: 20, fontWeight: '600' as const },
  heading4: { fontSize: 17, fontWeight: '600' as const },
  body1: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.5 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#1A6FE8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
};
