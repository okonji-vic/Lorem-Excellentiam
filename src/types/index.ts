export type UserRole = "developer" | "pm" | "executive"

export type TaskStatus = "not-started" | "in-progress" | "completed" | "blocked"

export type MilestoneStatus = "not-started" | "in-progress" | "completed" | "at-risk"

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignee: string
  priority: "low" | "medium" | "high" | "critical"
  estimatedHours: number
  actualHours: number
  dueDate: string
  createdAt: string
  updatedAt: string
  projectId: string
  milestoneId?: string
  tags: string[]
}

export interface Milestone {
  id: string
  title: string
  description: string
  status: MilestoneStatus
  progress: number
  startDate: string
  endDate: string
  projectId: string
  tasks: string[]
  dependencies: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled"
  progress: number
  startDate: string
  endDate: string
  budget: number
  spent: number
  teamMembers: string[]
  milestones: string[]
  priority: "low" | "medium" | "high" | "critical"
  client: string
  manager: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  avatar?: string
  skills: string[]
}

export interface ProjectContextType {
  projects: Project[]
  tasks: Task[]
  milestones: Milestone[]
  teamMembers: TeamMember[]
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  addMilestone: (milestone: Omit<Milestone, "id">) => void
  updateMilestone: (id: string, updates: Partial<Milestone>) => void
  getProjectTasks: (projectId: string) => Task[]
  getProjectMilestones: (projectId: string) => Milestone[]
  getMilestoneProgress: (milestoneId: string) => number
}
