"use client"

import { useTheme } from "../contexts/ThemeContext"
import { Sun, Moon, Activity } from "lucide-react"
import styles from "./Header.module.css"

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Activity className={styles.icon} />
        <h1 className={styles.title}>Project Delivery Dashboard</h1>
      </div>

      <div className={styles.actions}>
        <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  )
}
