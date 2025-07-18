import type React from "react"
import { useState } from "react"
import { useProject } from "../contexts/ProjectContext"
import type { TaskStatus } from "../types"
import { X } from "lucide-react"
import styles from "./TaskForm.module.css"

interface TaskFormProps {
  onClose: () => void
}

export function TaskForm({ onClose }: TaskFormProps) {
  const { addTask, projects, teamMembers } = useProject()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "not-started" as TaskStatus,
    assignee: "",
    priority: "medium" as const,
    estimatedHours: 8,
    dueDate: "",
    projectId: "",
    tags: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.projectId || !formData.assignee) {
      alert("Please fill in all required fields")
      return
    }

    addTask({
      ...formData,
      actualHours: 0,
      milestoneId: undefined,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    })

    onClose()
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Task</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={styles.input}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={styles.textarea}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Project *</label>
              <select
                value={formData.projectId}
                onChange={(e) => handleChange("projectId", e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Assignee *</label>
              <select
                value={formData.assignee}
                onChange={(e) => handleChange("assignee", e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Select assignee</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className={styles.select}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Estimated Hours</label>
              <input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => handleChange("estimatedHours", Number(e.target.value))}
                className={styles.input}
                min="0.5"
                step="0.5"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              className={styles.input}
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
