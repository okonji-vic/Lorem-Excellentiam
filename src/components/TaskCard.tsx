"use client"

import { useState } from "react"
import { useProject } from "../contexts/ProjectContext"
import type { Task, TaskStatus } from "../types"
import { Clock, User, Flag, Calendar, Edit3 } from "lucide-react"
import styles from "./TaskCard.module.css"

interface TaskCardProps {
  task: Task
}

const statusColors = {
  "not-started": "#6b7280",
  "in-progress": "#3b82f6",
  completed: "#10b981",
  blocked: "#ef4444",
}

const priorityColors = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#7c2d12",
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, projects } = useProject()
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState<TaskStatus>(task.status)

  const project = projects.find((p) => p.id === task.projectId)
  const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysUntilDue < 0
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus)
    updateTask(task.id, { status: newStatus })
  }

  const handleHoursUpdate = (actualHours: number) => {
    updateTask(task.id, { actualHours })
  }

  return (
    <div className={`${styles.card} ${isOverdue ? styles.overdue : ""} ${isDueSoon ? styles.dueSoon : ""}`}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h4 className={styles.title}>{task.title}</h4>
          <button onClick={() => setIsEditing(!isEditing)} className={styles.editButton} aria-label="Edit task">
            <Edit3 size={14} />
          </button>
        </div>

        <div className={styles.statusBadge} style={{ backgroundColor: statusColors[status] }}>
          {status.replace("-", " ")}
        </div>
      </div>

      <p className={styles.description}>{task.description}</p>

      <div className={styles.metadata}>
        <div className={styles.metaItem}>
          <User size={14} />
          <span>{task.assignee}</span>
        </div>

        <div className={styles.metaItem}>
          <Flag size={14} style={{ color: priorityColors[task.priority] }} />
          <span>{task.priority}</span>
        </div>

        <div className={styles.metaItem}>
          <Clock size={14} />
          <span>
            {task.actualHours}h / {task.estimatedHours}h
          </span>
        </div>

        <div className={`${styles.metaItem} ${isOverdue ? styles.overdueMeta : ""}`}>
          <Calendar size={14} />
          <span>
            {isOverdue
              ? `${Math.abs(daysUntilDue)} days overdue`
              : isDueSoon
                ? `Due in ${daysUntilDue} days`
                : new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {project && <div className={styles.projectTag}>{project.name}</div>}

      <div className={styles.tags}>
        {task.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      {isEditing && (
        <div className={styles.editPanel}>
          <div className={styles.editRow}>
            <label className={styles.editLabel}>Status:</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className={styles.editSelect}
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div className={styles.editRow}>
            <label className={styles.editLabel}>Hours:</label>
            <input
              type="number"
              value={task.actualHours}
              onChange={(e) => handleHoursUpdate(Number(e.target.value))}
              className={styles.editInput}
              min="0"
              step="0.5"
            />
          </div>
        </div>
      )}
    </div>
  )
}
