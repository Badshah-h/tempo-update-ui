// Professional color palette for the admin UI
export const colors = {
  // Primary colors
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Main primary color
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  
  // Secondary colors - Teal
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main secondary color
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },
  
  // Accent colors - Amber
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main accent color
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // Success, error, warning colors
  success: '#10b981', // Emerald-500
  error: '#ef4444',   // Red-500
  warning: '#f59e0b', // Amber-500
  info: '#3b82f6',    // Blue-500
  
  // Background colors
  background: {
    light: '#ffffff',
    dark: '#121212',
    lightMuted: '#f9fafb',
    darkMuted: '#1f2937',
  },
  
  // Text colors
  text: {
    light: {
      primary: '#171717',
      secondary: '#525252',
      muted: '#737373',
    },
    dark: {
      primary: '#f5f5f5',
      secondary: '#d4d4d4',
      muted: '#a3a3a3',
    },
  },
};

// Color themes
export const lightTheme = {
  background: colors.background.light,
  backgroundMuted: colors.background.lightMuted,
  text: colors.text.light.primary,
  textSecondary: colors.text.light.secondary,
  textMuted: colors.text.light.muted,
  primary: colors.primary[600],
  primaryHover: colors.primary[700],
  primaryMuted: colors.primary[100],
  secondary: colors.secondary[500],
  secondaryHover: colors.secondary[600],
  secondaryMuted: colors.secondary[100],
  accent: colors.accent[500],
  accentHover: colors.accent[600],
  accentMuted: colors.accent[100],
  border: colors.neutral[200],
  borderHover: colors.neutral[300],
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
};

export const darkTheme = {
  background: colors.background.dark,
  backgroundMuted: colors.background.darkMuted,
  text: colors.text.dark.primary,
  textSecondary: colors.text.dark.secondary,
  textMuted: colors.text.dark.muted,
  primary: colors.primary[500],
  primaryHover: colors.primary[400],
  primaryMuted: colors.primary[900],
  secondary: colors.secondary[400],
  secondaryHover: colors.secondary[300],
  secondaryMuted: colors.secondary[900],
  accent: colors.accent[400],
  accentHover: colors.accent[300],
  accentMuted: colors.accent[900],
  border: colors.neutral[800],
  borderHover: colors.neutral[700],
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
};
