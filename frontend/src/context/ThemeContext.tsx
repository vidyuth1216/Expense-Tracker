import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  DEFAULT_THEME,
  THEME_COLORS,
  THEME_STORAGE_KEY,
  type Theme,
  type ThemeColors,
} from '../constants/theme'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isMidnight: boolean
  isNeon: boolean
  colors: ThemeColors
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getInitialTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (savedTheme === 'midnight' || savedTheme === 'neon') {
      return savedTheme
    }
  } catch {
    // localStorage might be unavailable
  }
  return DEFAULT_THEME
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme === 'midnight' ? 'dark' : 'light'
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'midnight' ? 'neon' : 'midnight'))
  }

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
    isMidnight: theme === 'midnight',
    isNeon: theme === 'neon',
    colors: THEME_COLORS[theme],
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    return {
      theme: DEFAULT_THEME,
      setTheme: () => {},
      toggleTheme: () => {},
      isMidnight: DEFAULT_THEME === 'midnight',
      isNeon: DEFAULT_THEME === 'neon',
      colors: THEME_COLORS[DEFAULT_THEME],
    }
  }
  return context
}
