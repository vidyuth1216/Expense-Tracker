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
  accent: string
  accentHover: string
  primary: string
  primaryHover: string
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
    bg: '#0B0C0F',
    surface: '#121419',
    surfaceSecondary: '#181A21',
    surfaceElevated: '#1E2028',
    text: '#F2F1EE',
    textSecondary: '#9A9BA3',
    textMuted: '#666873',
    accent: '#9B8AFB',
    accentHover: '#6F61C0',
    primary: '#5A5478',
    primaryHover: '#6D6690',
    positive: '#5D9B76',
    negative: '#C66A72',
    warning: '#C89B58',
    border: '#292C34',
    borderStrong: '#3A3E48',
    brand: '#F5F2EB',
    chartIncome: '#5D9B76',
    chartExpense: '#C66A72',
    chartAccent: '#9B8AFB',
    chartNeutral: '#666873',
    chartBorder: '#292C34',
  },
  neon: {
    bg: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F3F5',
    surfaceElevated: '#FFFFFF',
    text: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    accent: '#7C3AED',
    accentHover: '#5B21B6',
    primary: '#7C3AED',
    primaryHover: '#6D28D9',
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
