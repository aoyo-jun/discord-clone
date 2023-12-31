"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

//Documentation on how to toggle themes: https://ui.shadcn.com/docs/dark-mode/next and https://www.npmjs.com/package/next-themes

export function ModeToggle() {
  // 'theme' is the current theme and 'setTheme' is used to change the theme
  const { theme, setTheme } = useTheme()

  // Function to toggle between themes
  function toggleTheme() {
    theme === "light" ? setTheme("dark") : setTheme("light");
  }

  return (
    <Button onClick={() => toggleTheme()} variant="outline" size="icon" className="bg-transparent border-0">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
