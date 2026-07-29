'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Project, projectStorage } from '@/lib/projectStorage'
import { Canvas } from 'fabric'
import { Plus, Download, Save, Square, Circle, Type } from 'lucide-react'

export default function NexGenDesign() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<any>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [projectName, setProjectName] = useState('Design Project')

  useEffect(() => {
    if (projectId) {
      const loaded = projectStorage.getProject(projectId)
      if (loaded) {
        setProject(loaded)
        setProjectName(loaded.name)
      }
    }
  }, [projectId])

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new Canvas(canvasRef.current, {
        width: typeof window !== 'undefined' ? Math.min(800, window.innerWidth - 40) : 800,
        height: 600,
        backgroundColor: '#0a0a0a',
      })
      setCanvas(fabricCanvas)

      return () => {
        fabricCanvas.dispose()
      }
    }
  }, [])

  const addRectangle = () => {
    if (canvas) {
      const rect = new canvas.constructor.Rect({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
        fill: '#4F46E5',
        stroke: '#06b6d4',
        strokeWidth: 2,
      })
      canvas.add(rect)
      canvas.renderAll()
    }
  }

  const addCircle = () => {
    if (canvas) {
      const circle = new canvas.constructor.Circle({
        left: 50,
        top: 50,
        radius: 50,
        fill: '#ec4899',
        stroke: '#06b6d4',
        strokeWidth: 2,
      })
      canvas.add(circle)
      canvas.renderAll()
    }
  }

  const addText = () => {
    if (canvas) {
      const text = new canvas.constructor.Text('Edit me', {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: '#ffffff',
        fontFamily: 'Inter, sans-serif',
      })
      canvas.add(text)
      canvas.renderAll()
    }
  }

  const deleteSelected = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject()
      if (activeObject) {
        canvas.remove(activeObject)
        canvas.renderAll()
      }
    }
  }

  const handleDownload = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
      })
      const link = document.createElement('a')
      link.href = dataURL
      link.download = `${projectName}.png`
      link.click()
    }
  }

  const handleSave = () => {
    if (canvas) {
      const newProject = project || projectStorage.createNewProject(projectName, 'vector')
      newProject.name = projectName
      newProject.data = { fabricJson: canvas.toJSON() }
      projectStorage.saveProject(newProject)
      setProject(newProject)
      alert('Project saved!')
    }
  }

  const handleClear = () => {
    if (canvas && window.confirm('Clear all objects?')) {
      canvas.clear()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">NexGen Design OS</h1>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-muted/50 text-foreground rounded px-3 py-1 text-sm w-full md:w-64"
              placeholder="Project name"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary/80 transition-colors"
            >
              <Save size={18} /> Save
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-3">
            <div className="glass rounded-xl p-4 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="border border-primary/20 rounded-lg"
              />
            </div>
          </div>

          {/* Tools */}
          <div className="glass rounded-xl p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">Tools</h2>
            <div className="space-y-3">
              <button
                onClick={addRectangle}
                className="w-full px-3 py-2 bg-primary/20 rounded-lg hover:bg-primary/40 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Square size={16} /> Rectangle
              </button>
              <button
                onClick={addCircle}
                className="w-full px-3 py-2 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Circle size={16} /> Circle
              </button>
              <button
                onClick={addText}
                className="w-full px-3 py-2 bg-accent/20 rounded-lg hover:bg-accent/40 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Type size={16} /> Text
              </button>
              <div className="border-t border-primary/20 pt-3">
                <button
                  onClick={deleteSelected}
                  className="w-full px-3 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/40 transition-colors text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={handleClear}
                  className="w-full px-3 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/40 transition-colors text-sm mt-2"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
