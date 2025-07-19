import type React from "react"
import { useState } from "react"
import { useProject } from "../contexts/ProjectContext"
import type { TaskStatus } from "../types"
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
} from "@fluentui/react-components"
import { Dismiss24Regular } from "@fluentui/react-icons"
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.projectId || !formData.assignee) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await addTask({
        ...formData,
        actualHours: 0,
        milestoneId: undefined,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      })
      onClose()
    } catch (error) {
      console.error("Failed to add task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle
            action={<Button appearance="subtle" aria-label="close" icon={<Dismiss24Regular />} onClick={onClose} />}
          >
            Add New Task
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Field label="Title" required>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </Field>

              <Field label="Description">
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter task description"
                  rows={3}
                />
              </Field>

              <div className={styles.formRow}>
                <Field label="Project" required>
                  <Dropdown
                    placeholder="Select project"
                    value={projects.find((p) => p.id === formData.projectId)?.name || ""}
                    onOptionSelect={(_, data) => handleChange("projectId", data.optionValue)}
                  >
                    {projects.map((project) => (
                      <Option key={project.id} value={project.id}>
                        {project.name}
                      </Option>
                    ))}
                  </Dropdown>
                </Field>

                <Field label="Assignee" required>
                  <Dropdown
                    placeholder="Select assignee"
                    value={formData.assignee}
                    onOptionSelect={(_, data) => handleChange("assignee", data.optionValue)}
                  >
                    {teamMembers.map((member) => (
                      <Option key={member.id} value={member.name}>
                        {member.name}
                      </Option>
                    ))}
                  </Dropdown>
                </Field>
              </div>

              <div className={styles.formRow}>
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

                <Field label="Estimated Hours">
                  <Input
                    type="number"
                    value={formData.estimatedHours.toString()}
                    onChange={(e) => handleChange("estimatedHours", Number(e.target.value))}
                    min={0.5}
                    step={0.5}
                  />
                </Field>
              </div>

              <Field label="Due Date">
                <Input type="date" value={formData.dueDate} onChange={(e) => handleChange("dueDate", e.target.value)} />
              </Field>

              <Field label="Tags">
                <Input
                  value={formData.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
              </Field>
            </form>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Task"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
