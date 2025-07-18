"use client"

import { useProject } from "../contexts/ProjectContext"
import type { Project } from "../types"
import { Calendar, DollarSign, Users, TrendingUp } from "lucide-react"
import styles from "./ProjectCard.module.css"

interface ProjectCardProps {
  project: Project
}

const statusColors = {
  planning: "#6b7280",
  active: "#3b82f6",
  "on-hold": "#f59e0b",
  completed: "#10b981",
  cancelled: "#ef4444",
}

const priorityColors = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#7c2d12",
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { getProjectTasks, getProjectMilestones } = useProject()

  const tasks = getProjectTasks(project.id)
  const milestones = getProjectMilestones(project.id)
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const budgetUtilization = Math.round((project.spent / project.budget) * 100)
  const daysUntilDeadline = Math.ceil(
    (new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{project.name}</h3>
          <div className={styles.badges}>
            <span className={styles.statusBadge} style={{ backgroundColor: statusColors[project.status] }}>
              {project.status.replace("-", " ")}
            </span>
            <span className={styles.priorityBadge} style={{ backgroundColor: priorityColors[project.priority] }}>
              {project.priority}
            </span>
          </div>
        </div>
      </div>

      <p className={styles.description}>{project.description}</p>

      <div className={styles.progress}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Overall Progress</span>
          <span className={styles.progressValue}>{project.progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricIcon}>
            <TrendingUp size={16} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{taskCompletionRate}%</span>
            <span className={styles.metricLabel}>Tasks Complete</span>
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricIcon}>
            <DollarSign size={16} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{budgetUtilization}%</span>
            <span className={styles.metricLabel}>Budget Used</span>
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricIcon}>
            <Users size={16} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{project.teamMembers.length}</span>
            <span className={styles.metricLabel}>Team Size</span>
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricIcon}>
            <Calendar size={16} />
          </div>
          <div className={styles.metricContent}>
            <span className={`${styles.metricValue} ${daysUntilDeadline < 30 ? styles.urgent : ""}`}>
              {daysUntilDeadline > 0 ? `${daysUntilDeadline}d` : "Overdue"}
            </span>
            <span className={styles.metricLabel}>Until Deadline</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.client}>
          <span className={styles.clientLabel}>Client:</span>
          <span className={styles.clientName}>{project.client}</span>
        </div>
        <div className={styles.milestoneCount}>{milestones.length} milestones</div>
      </div>
    </div>
  )
}
