export interface Project {
  id: string
  name: string
  type: 'photo' | 'color' | 'vector'
  thumbnail?: string
  data: Record<string, any>
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'design_studio_projects'

export const projectStorage = {
  getAllProjects(): Project[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading projects:', error)
      return []
    }
  },

  getProject(id: string): Project | null {
    const projects = this.getAllProjects()
    return projects.find(p => p.id === id) || null
  },

  saveProject(project: Project): void {
    if (typeof window === 'undefined') return
    try {
      const projects = this.getAllProjects()
      const index = projects.findIndex(p => p.id === project.id)
      
      if (index >= 0) {
        projects[index] = { ...project, updatedAt: Date.now() }
      } else {
        projects.push({ ...project, createdAt: Date.now(), updatedAt: Date.now() })
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    } catch (error) {
      console.error('Error saving project:', error)
    }
  },

  deleteProject(id: string): void {
    if (typeof window === 'undefined') return
    try {
      const projects = this.getAllProjects()
      const filtered = projects.filter(p => p.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  },

  createNewProject(name: string, type: 'photo' | 'color' | 'vector'): Project {
    return {
      id: `${type}_${Date.now()}`,
      name,
      type,
      data: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  },
}
