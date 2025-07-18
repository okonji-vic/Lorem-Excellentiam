"use client"

import type React from "react"

import { useState } from "react"
import { useProject } from "../contexts/ProjectContext"
import { X } from "lucide-react"
import styles from "./ProjectForm.module.css"

interface ProjectFormProps {
  onClose: () => void
}

export function ProjectForm({ onClose }: ProjectFormProps) {
  const { addProject, teamMembers } = useProject()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning" as const,
    startDate: "",
    endDate: "",
    budget: 100000,
    client: "",
    manager: "",
    priority: "medium" as const,
    teamMembers: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.client || !formData.manager) {
      alert("Please fill in all required fields")
      return
    }

    addProject({
      ...formData,
      progress: 0,
      spent: 0,
      milestones: [],
    })

    onClose()
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTeamMemberToggle = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter((id) => id !== memberId)
        : [...prev.teamMembers, memberId],
    }))
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create New Project</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Project Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={styles.input}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={styles.textarea}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Client *</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => handleChange("client", e.target.value)}
                className={styles.input}
                placeholder="Enter client name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Project Manager *</label>
              <select
                value={formData.manager}
                onChange={(e) => handleChange("manager", e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Select manager</option>
                {teamMembers
                  .filter((member) => member.role.toLowerCase().includes("manager"))
                  .map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Budget</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange("budget", Number(e.target.value))}
                className={styles.input}
                min="0"
                step="1000"
              />
            </div>

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
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Team Members</label>
            <div className={styles.teamGrid}>
              {teamMembers.map((member) => (
                <label key={member.id} className={styles.teamMember}>
                  <input
                    type="checkbox"
                    checked={formData.teamMembers.includes(member.id)}
                    onChange={() => handleTeamMemberToggle(member.id)}
                    className={styles.checkbox}
                  />
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>{member.name}</span>
                    <span className={styles.memberRole}>{member.role}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
