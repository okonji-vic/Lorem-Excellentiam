"use client"

import type { TaskStatus, Project } from "../types"
import { Filter } from "lucide-react"
import styles from "./FilterBar.module.css"

interface FilterBarProps {
  statusFilter: TaskStatus | "all"
  onStatusFilterChange: (status: TaskStatus | "all") => void
  projectFilter: string
  onProjectFilterChange: (projectId: string) => void
  projects: Project[]
}

export function FilterBar({
  statusFilter,
  onStatusFilterChange,
  projectFilter,
  onProjectFilterChange,
  projects,
}: FilterBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.filterGroup}>
        <Filter className={styles.icon} />
        <span className={styles.label}>Filters:</span>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as TaskStatus | "all")}
            className={styles.select}
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Project:</label>
          <select
            value={projectFilter}
            onChange={(e) => onProjectFilterChange(e.target.value)}
            className={styles.select}
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
