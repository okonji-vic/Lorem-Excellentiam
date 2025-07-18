import { useState } from "react"
import { RoleSelector } from "./components/RoleSelector"
import { DeveloperView } from "./components/views/DeveloperView"
import { PMView } from "./components/views/PMView"
import { ExecutiveView } from "./components/views/ExecutiveView"
import { Header } from "./components/Header"
import { ProjectProvider } from "./contexts/ProjectContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import type { UserRole } from "./types"
import styles from "./App.module.css"

function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>("developer")

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
    <ThemeProvider>
      <ProjectProvider>
        <div className={styles.container}>
          <Header />
          <div className={styles.content}>
            <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
            <main className={styles.main}>{renderView()}</main>
          </div>
        </div>
      </ProjectProvider>
    </ThemeProvider>
  )
}

export default App
