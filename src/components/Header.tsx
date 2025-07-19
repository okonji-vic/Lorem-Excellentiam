"use client"

import { useTheme } from "../contexts/ThemeContext"
import { Activity } from "lucide-react"
import { Button } from "@fluentui/react-components"
import { WeatherSunny24Regular, WeatherMoon24Regular } from "@fluentui/react-icons"
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
        <Button
          appearance="subtle"
          icon={theme === "light" ? <WeatherMoon24Regular /> : <WeatherSunny24Regular />}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        />
      </div>
    </header>
  )
}
