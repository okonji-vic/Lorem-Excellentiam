import type { Project, Task, Milestone, TeamMember } from "../types"

const STORAGE_KEYS = {
  PROJECTS: "dashboard_projects",
  TASKS: "dashboard_tasks",
  MILESTONES: "dashboard_milestones",
  TEAM_MEMBERS: "dashboard_team_members",
  LAST_UPDATED: "dashboard_last_updated",
} as const

export class LocalStorageService {
  // Generic storage methods
  private static setItem<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString())
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  private static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Failed to read from localStorage:", error)
      return null
    }
  }

  // Projects
  static saveProjects(projects: Project[]): void {
    this.setItem(STORAGE_KEYS.PROJECTS, projects)
  }

  static getProjects(): Project[] | null {
    return this.getItem<Project[]>(STORAGE_KEYS.PROJECTS)
  }

  // Tasks
  static saveTasks(tasks: Task[]): void {
    this.setItem(STORAGE_KEYS.TASKS, tasks)
  }

  static getTasks(): Task[] | null {
    return this.getItem<Task[]>(STORAGE_KEYS.TASKS)
  }

  // Milestones
  static saveMilestones(milestones: Milestone[]): void {
    this.setItem(STORAGE_KEYS.MILESTONES, milestones)
  }

  static getMilestones(): Milestone[] | null {
    return this.getItem<Milestone[]>(STORAGE_KEYS.MILESTONES)
  }

  // Team Members
  static saveTeamMembers(teamMembers: TeamMember[]): void {
    this.setItem(STORAGE_KEYS.TEAM_MEMBERS, teamMembers)
  }

  static getTeamMembers(): TeamMember[] | null {
    return this.getItem<TeamMember[]>(STORAGE_KEYS.TEAM_MEMBERS)
  }

  // Utility methods
  static getLastUpdated(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_UPDATED)
  }

  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  static hasStoredData(): boolean {
    return Boolean(this.getProjects() || this.getTasks() || this.getMilestones() || this.getTeamMembers())
  }
}
