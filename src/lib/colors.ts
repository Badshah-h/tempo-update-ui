// Enhanced professional color palette for the admin UI
export const colors = {
  // Primary colors - Rich Gold/Amber
  primary: {
    50: "#fefaf0",
    100: "#fdf3d7",
    200: "#fbe6af",
    300: "#f9d787",
    400: "#f7c85f",
    500: "#E6A817", // Main primary color - richer gold
    600: "#d18e14",
    700: "#a66f10",
    800: "#7c530c",
    900: "#523708",
    950: "#2a1c04",
  },

  // Secondary colors - Navy Blue
  secondary: {
    50: "#f0f4f9",
    100: "#dce5f0",
    200: "#bccce0",
    300: "#93aac9",
    400: "#6a88b4",
    500: "#4A6285", // Main secondary color - navy blue
    600: "#3d5069",
    700: "#2E4057", // Softer navy blue
    800: "#1f2b3a",
    900: "#121828", // Rich dark blue
    950: "#0a0f17",
  },

  // Accent colors - Soft Blue-Gray
  accent: {
    50: "#EDF2F7", // Soft blue-gray
    100: "#e2e8f0",
    200: "#cbd5e1",
    300: "#a9b8d5", // Soft blue-gray
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1E293B", // Deep blue-gray
    900: "#0f172a",
    950: "#020617",
  },

  // Neutral colors
  neutral: {
    50: "#F8FAFC", // Softer off-white
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0f172a",
    950: "#020617",
  },

  // Success, error, warning colors
  success: "#2DD4BF", // Teal
  error: "#F43F5E", // Rose-500
  warning: "#F7B731", // Bright Gold
  info: "#3B82F6", // Blue-500

  // Background colors
  background: {
    light: "#FFFFFF", // White
    dark: "#121828", // Rich dark blue
    lightMuted: "#F8FAFC", // Softer off-white
    darkMuted: "#1A223A", // Slightly lighter dark blue
  },

  // Text colors
  text: {
    light: {
      primary: "#121828", // Rich dark blue
      secondary: "#475569", // Slate-600
      muted: "#64748b", // Slate-500
    },
    dark: {
      primary: "#F8FAFC", // Off-white
      secondary: "#E2E8F0", // Slate-200
      muted: "#CBD5E1", // Slate-300
    },
  },
};

// Color themes
export const lightTheme = {
  background: "#FFFFFF", // White
  backgroundMuted: "#F8FAFC", // Softer off-white
  text: "#121828", // Rich dark blue
  textSecondary: "#475569", // Slate-600
  textMuted: "#64748b", // Slate-500
  primary: "#E6A817", // Rich gold
  primaryHover: "#d18e14", // Darker gold
  primaryMuted: "#fdf3d7", // Light gold
  secondary: "#2E4057", // Navy blue
  secondaryHover: "#3d5069", // Slightly lighter navy blue
  secondaryMuted: "#f0f4f9", // Very light blue
  accent: "#EDF2F7", // Soft blue-gray
  accentHover: "#e2e8f0", // Slightly darker blue-gray
  accentMuted: "#f8fafc", // Very light blue-gray
  border: "#e2e8f0", // Slate-200
  borderHover: "#cbd5e1", // Slate-300
  success: colors.success,
  error: colors.error,
  warning: "#F7B731", // Bright Gold
  info: colors.info,
};

export const darkTheme = {
  background: "#121828", // Rich dark blue
  backgroundMuted: "#1A223A", // Slightly lighter dark blue
  text: "#F8FAFC", // Off-white
  textSecondary: "#E2E8F0", // Slate-200
  textMuted: "#CBD5E1", // Slate-300
  primary: "#F7B731", // Bright gold
  primaryHover: "#f9d787", // Lighter gold
  primaryMuted: "#7c530c", // Dark gold
  secondary: "#4A6285", // Medium navy blue
  secondaryHover: "#6a88b4", // Lighter navy blue
  secondaryMuted: "#1f2b3a", // Dark navy blue
  accent: "#233047", // Deep blue-gray
  accentHover: "#334155", // Slightly lighter blue-gray
  accentMuted: "#1E293B", // Deep blue-gray
  border: "#2D3A58", // Dark border
  borderHover: "#3d5069", // Slightly lighter border
  success: "#34D399", // Brighter teal
  error: "#FB7185", // Brighter rose
  warning: "#F7B731", // Bright Gold
  info: "#60A5FA", // Brighter blue
};
