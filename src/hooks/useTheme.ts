import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'frv-theme'

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const saved = window.localStorage.getItem(THEME_KEY) as ThemeMode | null
  if (saved === 'light' || saved === 'dark') {
    return saved
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(getPreferredTheme)

  useEffect(() => {
    document.body.dataset.theme = theme
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggleTheme }
}
