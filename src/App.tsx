import { useState, useEffect, useRef } from "react"
import { RoleSelector } from "./components/RoleSelector"
import { DeveloperView } from "./components/views/DeveloperView"
import { PMView } from "./components/views/PMView"
import { ExecutiveView } from "./components/views/ExecutiveView"
import { Header } from "./components/Header"
import { ProjectProvider } from "./contexts/ProjectContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { FluentProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components"
import { useTheme } from "./contexts/ThemeContext"
import type { UserRole } from "./types"
import styles from "./App.module.css"

function AppContent() {
  const [currentRole, setCurrentRole] = useState<UserRole>("developer")
  const { theme } = useTheme()
  const mainRef = useRef<HTMLDivElement>(null)

  //  scroll to top anytime the role changes
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentRole])

  const renderView = () => {
    switch (currentRole) {
      case "developer":
        return <DeveloperView />
      case "pm":
        return <PMView />
      case "executive":
        return <ExecutiveView />
      default:
        return <DeveloperView />
    }
  }

  return (
    <FluentProvider theme={theme === "light" ? webLightTheme : webDarkTheme}>
      <div className={styles.container}>
        <Header />
        <div className={styles.content}>
          <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
          <main ref={mainRef} className={styles.main}>{renderView()}</main>
        </div>
      </div>
    </FluentProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </ThemeProvider>
  )
}

export default App
