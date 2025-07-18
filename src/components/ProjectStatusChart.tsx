"use client"

import type { Project } from "../types"
import styles from "./ProjectStatusChart.module.css"

interface ProjectStatusChartProps {
  projects: Project[]
}

const statusColors = {
  planning: "#6b7280",
  active: "#3b82f6",
  "on-hold": "#f59e0b",
  completed: "#10b981",
  cancelled: "#ef4444",
}

export function ProjectStatusChart({ projects }: ProjectStatusChartProps) {
  const statusCounts = projects.reduce(
    (acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const total = projects.length
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: Math.round((count / total) * 100),
  }))

  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        {statusData.map(({ status, count, percentage }) => (
          <div
            key={status}
            className={styles.segment}
            style={{
              width: `${percentage}%`,
              backgroundColor: statusColors[status as keyof typeof statusColors],
            }}
            title={`${status}: ${count} projects (${percentage}%)`}
          />
        ))}
      </div>

      <div className={styles.legend}>
        {statusData.map(({ status, count, percentage }) => (
          <div key={status} className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
            />
            <div className={styles.legendContent}>
              <span className={styles.legendLabel}>
                {status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
              <span className={styles.legendValue}>
                {count} ({percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
