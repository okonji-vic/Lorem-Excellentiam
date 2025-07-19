import type { Project, Task, Milestone, TeamMember } from "../types"

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5174/api"
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== "true"

// API Client
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>("/projects")
  }

  async createProject(project: Omit<Project, "id">): Promise<Project> {
    return this.request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    })
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: "DELETE",
    })
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>("/tasks")
  }

  async createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    })
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  async deleteTask(id: string): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: "DELETE",
    })
  }

  // Milestones
  async getMilestones(): Promise<Milestone[]> {
    return this.request<Milestone[]>("/milestones")
  }

  async createMilestone(milestone: Omit<Milestone, "id">): Promise<Milestone> {
    return this.request<Milestone>("/milestones", {
      method: "POST",
      body: JSON.stringify(milestone),
    })
  }

  async updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone> {
    return this.request<Milestone>(`/milestones/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  async deleteMilestone(id: string): Promise<void> {
    return this.request<void>(`/milestones/${id}`, {
      method: "DELETE",
    })
  }

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return this.request<TeamMember[]>("/team-members")
  }

  async createTeamMember(member: Omit<TeamMember, "id">): Promise<TeamMember> {
    return this.request<TeamMember>("/team-members", {
      method: "POST",
      body: JSON.stringify(member),
    })
  }

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    return this.request<TeamMember>(`/team-members/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  async deleteTeamMember(id: string): Promise<void> {
    return this.request<void>(`/team-members/${id}`, {
      method: "DELETE",
    })
  }
}

// Export API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export flag for mock data usage
export { USE_MOCK_DATA }
