'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/lib/theme'
import { Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useThemeStore()

  useEffect(() => {
    document.body.className = mode
  }, [mode])

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4">
        <Button variant="outline" size="icon" onClick={toggleMode}>
          {mode === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </div>
    </>
  )
}

