"use client"

import type { UserRole } from "../types"
import { User, Users, Crown } from "lucide-react"
import styles from "./RoleSelector.module.css"

interface RoleSelectorProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
}

const roleConfig = {
  developer: {
    label: "Developer",
    icon: User,
    description: "Task-focused view with technical details",
  },
  pm: {
    label: "Project Manager",
    icon: Users,
    description: "Project oversight and team coordination",
  },
  executive: {
    label: "Executive",
    icon: Crown,
    description: "High-level metrics and strategic overview",
  },
}

export function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Role View</h2>
      </div>

      <nav className={styles.nav}>
        {Object.entries(roleConfig).map(([role, config]) => {
          const Icon = config.icon
          const isActive = currentRole === role

          return (
            <button
              key={role}
              onClick={() => onRoleChange(role as UserRole)}
              className={`${styles.roleButton} ${isActive ? styles.active : ""}`}
              aria-pressed={isActive}
            >
              <div className={styles.roleIcon}>
                <Icon size={20} />
              </div>
              <div className={styles.roleContent}>
                <span className={styles.roleLabel}>{config.label}</span>
                <span className={styles.roleDescription}>{config.description}</span>
              </div>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
