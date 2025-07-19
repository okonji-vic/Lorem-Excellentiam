"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Project, Task, Milestone, TeamMember, ProjectContextType } from "../types"
import { mockData } from "../data/mockData"
import { apiClient, USE_MOCK_DATA } from "../services/api"
import { LocalStorageService } from "../services/localstorage"

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize data from localStorage or API/mock
  const initializeData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      if (USE_MOCK_DATA) {
        // Check localStorage first
        const storedProjects = LocalStorageService.getProjects()
        const storedTasks = LocalStorageService.getTasks()
        const storedMilestones = LocalStorageService.getMilestones()
        const storedTeamMembers = LocalStorageService.getTeamMembers()

        if (storedProjects || storedTasks || storedMilestones || storedTeamMembers) {
          // Use stored data if available
          setProjects(storedProjects || mockData.projects)
          setTasks(storedTasks || mockData.tasks)
          setMilestones(storedMilestones || mockData.milestones)
          setTeamMembers(storedTeamMembers || mockData.teamMembers)
        } else {
          // Use mock data and save to localStorage
          setProjects(mockData.projects)
          setTasks(mockData.tasks)
          setMilestones(mockData.milestones)
          setTeamMembers(mockData.teamMembers)

          LocalStorageService.saveProjects(mockData.projects)
          LocalStorageService.saveTasks(mockData.tasks)
          LocalStorageService.saveMilestones(mockData.milestones)
          LocalStorageService.saveTeamMembers(mockData.teamMembers)
        }
      } else {
        // Fetch from API
        const [projectsData, tasksData, milestonesData, teamMembersData] = await Promise.all([
          apiClient.getProjects(),
          apiClient.getTasks(),
          apiClient.getMilestones(),
          apiClient.getTeamMembers(),
        ])

        setProjects(projectsData)
        setTasks(tasksData)
        setMilestones(milestonesData)
        setTeamMembers(teamMembersData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
      console.error("Failed to initialize data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    initializeData()
  }, [initializeData])

  // Project operations
  const addProject = useCallback(
    async (project: Omit<Project, "id">) => {
      try {
        if (USE_MOCK_DATA) {
          const newProject: Project = {
            ...project,
            id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          }
          const updatedProjects = [...projects, newProject]
          setProjects(updatedProjects)
          LocalStorageService.saveProjects(updatedProjects)
        } else {
          const newProject = await apiClient.createProject(project)
          setProjects((prev) => [...prev, newProject])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add project")
        throw err
      }
    },
    [projects],
  )

  const updateProject = useCallback(
    async (id: string, updates: Partial<Project>) => {
      try {
        if (USE_MOCK_DATA) {
          const updatedProjects = projects.map((project) => (project.id === id ? { ...project, ...updates } : project))
          setProjects(updatedProjects)
          LocalStorageService.saveProjects(updatedProjects)
        } else {
          const updatedProject = await apiClient.updateProject(id, updates)
          setProjects((prev) => prev.map((project) => (project.id === id ? updatedProject : project)))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update project")
        throw err
      }
    },
    [projects],
  )

  // Task operations
  const addTask = useCallback(
    async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      try {
        if (USE_MOCK_DATA) {
          const newTask: Task = {
            ...task,
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          const updatedTasks = [...tasks, newTask]
          setTasks(updatedTasks)
          LocalStorageService.saveTasks(updatedTasks)
        } else {
          const newTask = await apiClient.createTask(task)
          setTasks((prev) => [...prev, newTask])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add task")
        throw err
      }
    },
    [tasks],
  )

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      try {
        if (USE_MOCK_DATA) {
          const updatedTasks = tasks.map((task) =>
            task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task,
          )
          setTasks(updatedTasks)
          LocalStorageService.saveTasks(updatedTasks)
        } else {
          const updatedTask = await apiClient.updateTask(id, updates)
          setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update task")
        throw err
      }
    },
    [tasks],
  )

  // Milestone operations
  const addMilestone = useCallback(
    async (milestone: Omit<Milestone, "id">) => {
      try {
        if (USE_MOCK_DATA) {
          const newMilestone: Milestone = {
            ...milestone,
            id: `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          }
          const updatedMilestones = [...milestones, newMilestone]
          setMilestones(updatedMilestones)
          LocalStorageService.saveMilestones(updatedMilestones)
        } else {
          const newMilestone = await apiClient.createMilestone(milestone)
          setMilestones((prev) => [...prev, newMilestone])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add milestone")
        throw err
      }
    },
    [milestones],
  )

  const updateMilestone = useCallback(
    async (id: string, updates: Partial<Milestone>) => {
      try {
        if (USE_MOCK_DATA) {
          const updatedMilestones = milestones.map((milestone) =>
            milestone.id === id ? { ...milestone, ...updates } : milestone,
          )
          setMilestones(updatedMilestones)
          LocalStorageService.saveMilestones(updatedMilestones)
        } else {
          const updatedMilestone = await apiClient.updateMilestone(id, updates)
          setMilestones((prev) => prev.map((milestone) => (milestone.id === id ? updatedMilestone : milestone)))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update milestone")
        throw err
      }
    },
    [milestones],
  )

  // Team member operations
  const addTeamMember = useCallback(
    async (member: Omit<TeamMember, "id">) => {
      try {
        if (USE_MOCK_DATA) {
          const newMember: TeamMember = {
            ...member,
            id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          }
          const updatedMembers = [...teamMembers, newMember]
          setTeamMembers(updatedMembers)
          LocalStorageService.saveTeamMembers(updatedMembers)
        } else {
          const newMember = await apiClient.createTeamMember(member)
          setTeamMembers((prev) => [...prev, newMember])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add team member")
        throw err
      }
    },
    [teamMembers],
  )

  const updateTeamMember = useCallback(
    async (id: string, updates: Partial<TeamMember>) => {
      try {
        if (USE_MOCK_DATA) {
          const updatedMembers = teamMembers.map((member) => (member.id === id ? { ...member, ...updates } : member))
          setTeamMembers(updatedMembers)
          LocalStorageService.saveTeamMembers(updatedMembers)
        } else {
          const updatedMember = await apiClient.updateTeamMember(id, updates)
          setTeamMembers((prev) => prev.map((member) => (member.id === id ? updatedMember : member)))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update team member")
        throw err
      }
    },
    [teamMembers],
  )

  // Utility functions
  const getProjectTasks = useCallback(
    (projectId: string): Task[] => {
      return tasks.filter((task) => task.projectId === projectId)
    },
    [tasks],
  )

  const getProjectMilestones = useCallback(
    (projectId: string): Milestone[] => {
      return milestones.filter((milestone) => milestone.projectId === projectId)
    },
    [milestones],
  )

  const getMilestoneProgress = useCallback(
    (milestoneId: string): number => {
      const milestoneTasks = tasks.filter((task) => task.milestoneId === milestoneId)
      if (milestoneTasks.length === 0) return 0

      const completedTasks = milestoneTasks.filter((task) => task.status === "completed")
      return Math.round((completedTasks.length / milestoneTasks.length) * 100)
    },
    [tasks],
  )

  // Refresh data
  const refreshData = useCallback(() => {
    initializeData()
  }, [initializeData])

  const value: ProjectContextType = {
    projects,
    tasks,
    milestones,
    teamMembers,
    loading,
    error,
    addProject,
    updateProject,
    addTask,
    updateTask,
    addMilestone,
    updateMilestone,
    addTeamMember,
    updateTeamMember,
    getProjectTasks,
    getProjectMilestones,
    getMilestoneProgress,
    refreshData,
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
