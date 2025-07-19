"use client"

import type React from "react"

import { useState } from "react"
import { useProject } from "../contexts/ProjectContext"
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Input,
  Textarea,
  Dropdown,
  Option,
  Field,
  Checkbox,
} from "@fluentui/react-components"
import { Dismiss24Regular } from "@fluentui/react-icons"
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.client || !formData.manager) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await addProject({
        ...formData,
        progress: 0,
        spent: 0,
        milestones: [],
      })
      onClose()
    } catch (error) {
      console.error("Failed to add project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTeamMemberToggle = (memberId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: checked ? [...prev.teamMembers, memberId] : prev.teamMembers.filter((id) => id !== memberId),
    }))
  }

  return (
    <Dialog open onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle
            action={<Button appearance="subtle" aria-label="close" icon={<Dismiss24Regular />} onClick={onClose} />}
          >
            Create New Project
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Field label="Project Name" required>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter project name"
                  required
                />
              </Field>

              <Field label="Description">
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter project description"
                  rows={3}
                />
              </Field>

              <div className={styles.formRow}>
                <Field label="Client" required>
                  <Input
                    value={formData.client}
                    onChange={(e) => handleChange("client", e.target.value)}
                    placeholder="Enter client name"
                    required
                  />
                </Field>

                <Field label="Project Manager" required>
                  <Dropdown
                    placeholder="Select manager"
                    value={teamMembers.find((m) => m.id === formData.manager)?.name || ""}
                    onOptionSelect={(_, data) => handleChange("manager", data.optionValue)}
                  >
                    {teamMembers
                      .filter((member) => member.role.toLowerCase().includes("manager"))
                      .map((member) => (
                        <Option key={member.id} value={member.id}>
                          {member.name}
                        </Option>
                      ))}
                  </Dropdown>
                </Field>
              </div>

              <div className={styles.formRow}>
                <Field label="Start Date">
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                  />
                </Field>

                <Field label="End Date">
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                  />
                </Field>
              </div>

              <div className={styles.formRow}>
                <Field label="Budget">
                  <Input
                    type="number"
                    value={formData.budget.toString()}
                    onChange={(e) => handleChange("budget", Number(e.target.value))}
                    min={0}
                    step={1000}
                  />
                </Field>

                <Field label="Priority">
                  <Dropdown
                    value={formData.priority}
                    onOptionSelect={(_, data) => handleChange("priority", data.optionValue)}
                  >
                    <Option value="low">Low</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="high">High</Option>
                    <Option value="critical">Critical</Option>
                  </Dropdown>
                </Field>
              </div>

              <Field label="Team Members">
                <div className={styles.teamGrid}>
                  {teamMembers.map((member) => (
                    <Checkbox
                      key={member.id}
                      label={`${member.name} - ${member.role}`}
                      checked={formData.teamMembers.includes(member.id)}
                      onChange={(_, data) => handleTeamMemberToggle(member.id, data.checked === true)}
                    />
                  ))}
                </div>
              </Field>
            </form>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
