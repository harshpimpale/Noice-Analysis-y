import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Mode = 'light' | 'dark'

interface ThemeState {
  mode: Mode
  setMode: (mode: Mode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage',
    }
  )
)

