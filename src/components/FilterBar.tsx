import type { TaskStatus, Project } from "../types"
import { Filter } from "lucide-react"
import { Dropdown, Option, Label } from "@fluentui/react-components"
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
          <Label className={styles.filterLabel}>Status:</Label>
          <Dropdown
            value={
              statusFilter === "all"
                ? "All Status"
                : statusFilter.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
            }
            onOptionSelect={(_, data) => onStatusFilterChange(data.optionValue as TaskStatus | "all")}
            className={styles.dropdown}
          >
            <Option value="all">All Status</Option>
            <Option value="not-started">Not Started</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="completed">Completed</Option>
            <Option value="blocked">Blocked</Option>
          </Dropdown>
        </div>

        <div className={styles.filterItem}>
          <Label className={styles.filterLabel}>Project:</Label>
          <Dropdown
            value={
              projectFilter === "all"
                ? "All Projects"
                : projects.find((p) => p.id === projectFilter)?.name || "All Projects"
            }
            onOptionSelect={(_, data) => onProjectFilterChange(data.optionValue as string)}
            className={styles.dropdown}
          >
            <Option value="all">All Projects</Option>
            {projects.map((project) => (
              <Option key={project.id} value={project.id}>
                {project.name}
              </Option>
            ))}
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
