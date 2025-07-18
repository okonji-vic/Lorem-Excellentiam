"use client"

import { useProject } from "../contexts/ProjectContext"
import type { Milestone } from "../types"
import { Calendar, Target, AlertTriangle, CheckCircle } from "lucide-react"
import styles from "./MilestoneCard.module.css"

interface MilestoneCardProps {
  milestone: Milestone
}

const statusColors = {
  "not-started": "#6b7280",
  "in-progress": "#3b82f6",
  completed: "#10b981",
  "at-risk": "#ef4444",
}

const statusIcons = {
  "not-started": Target,
  "in-progress": Target,
  completed: CheckCircle,
  "at-risk": AlertTriangle,
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { projects, getMilestoneProgress } = useProject()

  const project = projects.find((p) => p.id === milestone.projectId)
  const calculatedProgress = getMilestoneProgress(milestone.id)
  const actualProgress = calculatedProgress || milestone.progress

  const startDate = new Date(milestone.startDate)
  const endDate = new Date(milestone.endDate)
  const now = new Date()
  const daysUntilDeadline = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysUntilDeadline < 0
  const isDueSoon = daysUntilDeadline <= 7 && daysUntilDeadline >= 0

  const StatusIcon = statusIcons[milestone.status]

  return (
    <div className={`${styles.card} ${isOverdue ? styles.overdue : ""} ${isDueSoon ? styles.dueSoon : ""}`}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.iconWrapper}>
            <StatusIcon size={20} style={{ color: statusColors[milestone.status] }} />
          </div>
          <div>
            <h3 className={styles.title}>{milestone.title}</h3>
            {project && <span className={styles.projectName}>{project.name}</span>}
          </div>
        </div>

        <div className={styles.statusBadge} style={{ backgroundColor: statusColors[milestone.status] }}>
          {milestone.status.replace("-", " ")}
        </div>
      </div>

      <p className={styles.description}>{milestone.description}</p>

      <div className={styles.progress}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressValue}>{actualProgress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${actualProgress}%`,
              backgroundColor: statusColors[milestone.status],
            }}
          />
        </div>
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineItem}>
          <Calendar size={14} />
          <div className={styles.timelineContent}>
            <span className={styles.timelineLabel}>Start Date</span>
            <span className={styles.timelineValue}>{startDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div className={styles.timelineItem}>
          <Calendar size={14} />
          <div className={styles.timelineContent}>
            <span className={styles.timelineLabel}>End Date</span>
            <span className={`${styles.timelineValue} ${isOverdue ? styles.overdue : ""}`}>
              {endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.taskCount}>{milestone.tasks.length} tasks</div>

        <div className={`${styles.deadline} ${isOverdue ? styles.overdue : isDueSoon ? styles.dueSoon : ""}`}>
          {isOverdue
            ? `${Math.abs(daysUntilDeadline)} days overdue`
            : isDueSoon
              ? `Due in ${daysUntilDeadline} days`
              : `${daysUntilDeadline} days remaining`}
        </div>
      </div>

      {milestone.dependencies.length > 0 && (
        <div className={styles.dependencies}>
          <span className={styles.dependencyLabel}>Dependencies:</span>
          <span className={styles.dependencyCount}>
            {milestone.dependencies.length} milestone{milestone.dependencies.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  )
}
