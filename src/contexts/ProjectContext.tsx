"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Project, Task, Milestone, TeamMember, ProjectContextType } from "../types"
import { mockData } from "../data/mockData"

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockData.projects)
  const [tasks, setTasks] = useState<Task[]>(mockData.tasks)
  const [milestones, setMilestones] = useState<Milestone[]>(mockData.milestones)
  const [teamMembers] = useState<TeamMember[]>(mockData.teamMembers)

  const addProject = (project: Omit<Project, "id">) => {
    const newProject: Project = {
      ...project,
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
    setProjects((prev) => [...prev, newProject])
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((project) => (project.id === id ? { ...project, ...updates } : project)))
  }

  const addTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task)),
    )
  }

  const addMilestone = (milestone: Omit<Milestone, "id">) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
    setMilestones((prev) => [...prev, newMilestone])
  }

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones((prev) => prev.map((milestone) => (milestone.id === id ? { ...milestone, ...updates } : milestone)))
  }

  const getProjectTasks = (projectId: string): Task[] => {
    return tasks.filter((task) => task.projectId === projectId)
  }

  const getProjectMilestones = (projectId: string): Milestone[] => {
    return milestones.filter((milestone) => milestone.projectId === projectId)
  }

  const getMilestoneProgress = (milestoneId: string): number => {
    const milestoneTasks = tasks.filter((task) => task.milestoneId === milestoneId)
    if (milestoneTasks.length === 0) return 0

    const completedTasks = milestoneTasks.filter((task) => task.status === "completed")
    return Math.round((completedTasks.length / milestoneTasks.length) * 100)
  }

  const value: ProjectContextType = {
    projects,
    tasks,
    milestones,
    teamMembers,
    addProject,
    updateProject,
    addTask,
    updateTask,
    addMilestone,
    updateMilestone,
    getProjectTasks,
    getProjectMilestones,
    getMilestoneProgress,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}
