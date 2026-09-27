export type Theme = 'midnight' | 'neon'

export const THEME_STORAGE_KEY = 'everyday_theme'
export const DEFAULT_THEME: Theme = 'midnight'

export interface ThemeColors {
  bg: string
  surface: string
  surfaceSecondary: string
  surfaceElevated: string
  text: string
  textSecondary: string
  textMuted: string
  primary: string
  primaryHover: string
  accent: string
  accentHover: string
  danger: string
  success: string
  positive: string
  negative: string
  warning: string
  border: string
  borderStrong: string
  brand: string
  chartIncome: string
  chartExpense: string
  chartAccent: string
  chartNeutral: string
  chartBorder: string
}

export const THEME_COLORS: Record<Theme, ThemeColors> = {
  midnight: {
    bg: '#15131d',
    surface: '#1f1c2b',
    surfaceSecondary: '#242032',
    surfaceElevated: '#282536',
    text: '#ffffff',
    textSecondary: '#9ca3af',
    textMuted: '#9ca3af',
    primary: '#6b5b8a',
    primaryHover: '#7e6ca0',
    accent: '#6b5b8a',
    accentHover: '#7e6ca0',
    danger: '#d27269',
    success: '#5d9b84',
    positive: '#5d9b84',
    negative: '#d27269',
    warning: '#c89b58',
    border: '#2e2a3d',
    borderStrong: '#3c374d',
    brand: '#f0e4d3',
    chartIncome: '#5d9b84',
    chartExpense: '#d27269',
    chartAccent: '#6b5b8a',
    chartNeutral: '#9ca3af',
    chartBorder: '#2e2a3d',
  },
  neon: {
    bg: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F3F5',
    surfaceElevated: '#FFFFFF',
    text: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    primary: '#7C3AED',
    primaryHover: '#6D28D9',
    accent: '#7C3AED',
    accentHover: '#5B21B6',
    danger: '#DC2626',
    success: '#059669',
    positive: '#059669',
    negative: '#DC2626',
    warning: '#D97706',
    border: '#E5E7EB',
    borderStrong: '#D1D5DB',
    brand: '#111827',
    chartIncome: '#059669',
    chartExpense: '#DC2626',
    chartAccent: '#7C3AED',
    chartNeutral: '#9CA3AF',
    chartBorder: '#E5E7EB',
  },
}
