'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Project, projectStorage } from '@/lib/projectStorage'
import { Plus, Trash2 } from 'lucide-react'

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const allProjects = projectStorage.getAllProjects()
    setProjects(allProjects)
  }, [])

  const handleDeleteProject = (id: string) => {
    projectStorage.deleteProject(id)
    setProjects(projectStorage.getAllProjects())
  }

  const tools = [
    {
      name: 'Gov Photo Pro',
      description: 'Professional photo editing with cropping and filters',
      path: '/photo-pro',
      color: 'from-blue-500 to-cyan-500',
      icon: '📸',
    },
    {
      name: 'Chroma Studio',
      description: 'Create and manage color palettes and gradients',
      path: '/chroma-studio',
      color: 'from-purple-500 to-pink-500',
      icon: '🎨',
    },
    {
      name: 'NexGen Design OS',
      description: 'Vector design and graphic composition',
      path: '/nexgen-design',
      color: 'from-green-500 to-emerald-500',
      icon: '✨',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Main content */}
      <main className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Design Studio Suite</h1>
          <p className="text-foreground/60">Create, edit, and design all in one place</p>
        </div>

        {/* Tools Grid */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {tools.map(tool => (
              <Link key={tool.path} href={tool.path}>
                <div className="glass rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group">
                  <div className="text-4xl mb-4">{tool.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-foreground/60 text-sm mb-4">{tool.description}</p>
                  <div className="h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Projects */}
        {isClient && projects.length > 0 && (
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <div key={project.id} className="glass rounded-xl p-4 group hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-primary uppercase font-semibold tracking-wider">
                        {project.type === 'photo' && 'Photo Pro'}
                        {project.type === 'color' && 'Chroma Studio'}
                        {project.type === 'vector' && 'NexGen Design'}
                      </p>
                      <h3 className="text-lg font-semibold line-clamp-2">{project.name}</h3>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-accent"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-foreground/50 text-xs">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                  <Link href={`/${project.type === 'photo' ? 'photo-pro' : project.type === 'color' ? 'chroma-studio' : 'nexgen-design'}?projectId=${project.id}`}>
                    <div className="mt-3 p-2 rounded bg-primary/10 hover:bg-primary/20 transition-colors text-center text-sm">
                      Open
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
