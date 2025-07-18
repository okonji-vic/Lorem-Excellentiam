"use client"

import { useState } from "react"
import { useProject } from "../../contexts/ProjectContext"
import { TaskCard } from "../TaskCard"
import { TaskForm } from "../TaskForm"
import { FilterBar } from "../FilterBar"
import type { TaskStatus } from "../../types"
import { Plus, Code, Clock, CheckCircle } from "lucide-react"
import styles from "./DeveloperView.module.css"

export function DeveloperView() {
  const { tasks, projects } = useProject()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [projectFilter, setProjectFilter] = useState<string>("all")

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === "all" || task.status === statusFilter
    const projectMatch = projectFilter === "all" || task.projectId === projectFilter
    return statusMatch && projectMatch
  })

  const tasksByStatus = {
    "not-started": filteredTasks.filter((t) => t.status === "not-started"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
    blocked: filteredTasks.filter((t) => t.status === "blocked"),
  }

  const totalHours = filteredTasks.reduce((sum, task) => sum + task.actualHours, 0)
  const estimatedHours = filteredTasks.reduce((sum, task) => sum + task.estimatedHours, 0)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Code className={styles.icon} />
          <div>
            <h1 className={styles.title}>Developer Dashboard</h1>
            <p className={styles.subtitle}>Task management and development tracking</p>
          </div>
        </div>

        <button onClick={() => setShowTaskForm(true)} className={styles.addButton}>
          <Plus size={20} />
          Add Task
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{totalHours}h</span>
            <span className={styles.statLabel}>Hours Logged</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{tasksByStatus.completed.length}</span>
            <span className={styles.statLabel}>Completed Tasks</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Code />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{Math.round((totalHours / estimatedHours) * 100) || 0}%</span>
            <span className={styles.statLabel}>Time Efficiency</span>
          </div>
        </div>
      </div>

      <FilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        projectFilter={projectFilter}
        onProjectFilterChange={setProjectFilter}
        projects={projects}
      />

      <div className={styles.kanban}>
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className={styles.column}>
            <div className={styles.columnHeader}>
              <h3 className={styles.columnTitle}>
                {status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </h3>
              <span className={styles.taskCount}>{statusTasks.length}</span>
            </div>

            <div className={styles.taskList}>
              {statusTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} />}
    </div>
  )
}
