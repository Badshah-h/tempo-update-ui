// Professional color palette for the admin UI
export const colors = {
  // Primary colors - Gold/Amber
  primary: {
    50: '#fdf8eb',
    100: '#faefd0',
    200: '#f6e0a1',
    300: '#f1d072',
    400: '#edc143',
    500: '#D39931', // Main primary color
    600: '#b37a28',
    700: '#935c1f',
    800: '#734016',
    900: '#522c0e',
    950: '#311a07',
  },

  // Secondary colors - Dark Blue
  secondary: {
    50: '#f0f4ff',
    100: '#dbe4ff',
    200: '#bac8ff',
    300: '#8da3ff',
    400: '#5a72ff',
    500: '#3445ff', // Main secondary color
    600: '#1d2be0',
    700: '#1621b3',
    800: '#111a8a',
    900: '#0c1361',
    950: '#020817', // Very dark blue
  },

  // Accent colors - Gold/Amber (same as primary for consistency)
  accent: {
    50: '#fdf8eb',
    100: '#faefd0',
    200: '#f6e0a1',
    300: '#f1d072',
    400: '#edc143',
    500: '#D39931', // Main accent color
    600: '#b37a28',
    700: '#935c1f',
    800: '#734016',
    900: '#522c0e',
    950: '#311a07',
  },

  // Neutral colors
  neutral: {
    50: '#F6F7FA', // Light gray/off-white
    100: '#ebedf2',
    200: '#d5d9e5',
    300: '#b3bbd0',
    400: '#8c97b7',
    500: '#6b7799',
    600: '#525c7a',
    700: '#3e4660',
    800: '#2a3045',
    900: '#1a1e2c',
    950: '#020817', // Very dark blue
  },

  // Success, error, warning colors
  success: '#10b981', // Emerald-500
  error: '#ef4444',   // Red-500
  warning: '#D39931', // Gold/Amber
  info: '#3b82f6',    // Blue-500

  // Background colors
  background: {
    light: '#FFFFFF', // White
    dark: '#020817',  // Very dark blue
    lightMuted: '#F6F7FA', // Light gray/off-white
    darkMuted: '#111a8a', // Slightly lighter dark blue
  },

  // Text colors
  text: {
    light: {
      primary: '#020817', // Very dark blue
      secondary: '#3e4660',
      muted: '#6b7799',
    },
    dark: {
      primary: '#FFFFFF', // White
      secondary: '#F6F7FA', // Light gray/off-white
      muted: '#d5d9e5',
    },
  },
};

// Color themes
export const lightTheme = {
  background: '#FFFFFF', // White
  backgroundMuted: '#F6F7FA', // Light gray/off-white
  text: '#020817', // Very dark blue
  textSecondary: '#3e4660',
  textMuted: '#6b7799',
  primary: '#D39931', // Gold/Amber
  primaryHover: '#b37a28', // Darker gold
  primaryMuted: '#faefd0', // Light gold
  secondary: '#020817', // Very dark blue
  secondaryHover: '#1a1e2c', // Slightly lighter dark blue
  secondaryMuted: '#F6F7FA', // Light gray/off-white
  accent: '#D39931', // Gold/Amber (same as primary)
  accentHover: '#b37a28', // Darker gold
  accentMuted: '#faefd0', // Light gold
  border: '#d5d9e5',
  borderHover: '#b3bbd0',
  success: colors.success,
  error: colors.error,
  warning: '#D39931', // Gold/Amber
  info: colors.info,
};

export const darkTheme = {
  background: '#020817', // Very dark blue
  backgroundMuted: '#111a8a', // Slightly lighter dark blue
  text: '#FFFFFF', // White
  textSecondary: '#F6F7FA', // Light gray/off-white
  textMuted: '#d5d9e5',
  primary: '#D39931', // Gold/Amber
  primaryHover: '#edc143', // Lighter gold
  primaryMuted: '#522c0e', // Dark gold
  secondary: '#5a72ff', // Lighter blue
  secondaryHover: '#8da3ff', // Even lighter blue
  secondaryMuted: '#0c1361', // Dark blue
  accent: '#D39931', // Gold/Amber (same as primary)
  accentHover: '#edc143', // Lighter gold
  accentMuted: '#522c0e', // Dark gold
  border: '#2a3045',
  borderHover: '#3e4660',
  success: colors.success,
  error: colors.error,
  warning: '#D39931', // Gold/Amber
  info: colors.info,
};
