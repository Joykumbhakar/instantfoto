'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Project, projectStorage } from '@/lib/projectStorage'
import { Plus, Trash2, Save, Download } from 'lucide-react'

interface Color {
  id: string
  hex: string
  rgb: string
  name: string
}

interface Gradient {
  id: string
  name: string
  colors: string[]
  angle: number
}

export default function ChromaStudio() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  
  const [project, setProject] = useState<Project | null>(null)
  const [projectName, setProjectName] = useState('Color Palette')
  const [colors, setColors] = useState<Color[]>([
    { id: '1', hex: '#4F46E5', rgb: '79, 70, 229', name: 'Primary' },
    { id: '2', hex: '#06b6d4', rgb: '6, 182, 212', name: 'Secondary' },
    { id: '3', hex: '#ec4899', rgb: '236, 72, 153', name: 'Accent' },
  ])
  const [gradients, setGradients] = useState<Gradient[]>([
    {
      id: '1',
      name: 'Sunset',
      colors: ['#4F46E5', '#ec4899'],
      angle: 135,
    },
  ])
  const [newColorHex, setNewColorHex] = useState('#000000')
  const [newColorName, setNewColorName] = useState('')

  useEffect(() => {
    if (projectId) {
      const loaded = projectStorage.getProject(projectId)
      if (loaded) {
        setProject(loaded)
        setProjectName(loaded.name)
        if (loaded.data.colors) setColors(loaded.data.colors)
        if (loaded.data.gradients) setGradients(loaded.data.gradients)
      }
    }
  }, [projectId])

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '0, 0, 0'
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
  }

  const addColor = () => {
    if (newColorHex && newColorName) {
      const newColor: Color = {
        id: `color_${Date.now()}`,
        hex: newColorHex,
        rgb: hexToRgb(newColorHex),
        name: newColorName,
      }
      setColors([...colors, newColor])
      setNewColorHex('#000000')
      setNewColorName('')
    }
  }

  const deleteColor = (id: string) => {
    setColors(colors.filter(c => c.id !== id))
  }

  const deleteGradient = (id: string) => {
    setGradients(gradients.filter(g => g.id !== id))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied!')
  }

  const handleSave = () => {
    const newProject = project || projectStorage.createNewProject(projectName, 'color')
    newProject.name = projectName
    newProject.data = { colors, gradients }
    projectStorage.saveProject(newProject)
    setProject(newProject)
    alert('Project saved!')
  }

  const handleExport = () => {
    const css = `/* ${projectName} */\n:root {\n${colors.map(c => `  --color-${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.hex};`).join('\n')}\n}\n`
    const link = document.createElement('a')
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(css)}`
    link.download = `${projectName}.css`
    link.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Chroma Studio</h1>
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
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Add Color */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Add Color</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Color</label>
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-full h-12 rounded cursor-pointer"
                />
                <p className="text-xs text-foreground/60 mt-1">{newColorHex}</p>
                <p className="text-xs text-foreground/60">RGB: {hexToRgb(newColorHex)}</p>
              </div>
              <div>
                <label className="block text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="e.g., Primary Blue"
                  className="w-full bg-muted/50 text-foreground rounded px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={addColor}
                className="w-full px-4 py-2 bg-primary rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            </div>
          </div>

          {/* Colors Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {colors.map(color => (
              <div key={color.id} className="glass rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-lg border border-primary/20 cursor-pointer hover:border-primary transition-colors"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyToClipboard(color.hex)}
                    title="Click to copy HEX"
                  />
                  <button
                    onClick={() => deleteColor(color.id)}
                    className="p-1 hover:bg-accent/20 rounded transition-colors"
                  >
                    <Trash2 size={16} className="text-accent" />
                  </button>
                </div>
                <h3 className="font-semibold mb-2">{color.name}</h3>
                <p className="text-xs text-foreground/60 cursor-pointer hover:text-primary" onClick={() => copyToClipboard(color.hex)}>
                  {color.hex}
                </p>
                <p className="text-xs text-foreground/60 cursor-pointer hover:text-primary" onClick={() => copyToClipboard(color.rgb)}>
                  rgb({color.rgb})
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Gradients */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Gradients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gradients.map(gradient => (
              <div key={gradient.id} className="glass rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-full h-24 rounded-lg border border-primary/20"
                    style={{
                      background: `linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')})`,
                    }}
                  />
                  <button
                    onClick={() => deleteGradient(gradient.id)}
                    className="p-1 hover:bg-accent/20 rounded transition-colors"
                  >
                    <Trash2 size={16} className="text-accent" />
                  </button>
                </div>
                <h3 className="font-semibold">{gradient.name}</h3>
                <p className="text-xs text-foreground/60">{gradient.angle}° angle</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
