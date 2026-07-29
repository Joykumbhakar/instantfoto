'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Project, projectStorage } from '@/lib/projectStorage'
import Cropper from 'cropperjs'
import { Plus, Download, Save } from 'lucide-react'

export default function PhotoPro() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  
  const [project, setProject] = useState<Project | null>(null)
  const [projectName, setProjectName] = useState('Untitled Project')
  const [image, setImage] = useState<string | null>(null)
  const [cropper, setCropper] = useState<Cropper | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (projectId) {
      const loaded = projectStorage.getProject(projectId)
      if (loaded) {
        setProject(loaded)
        setProjectName(loaded.name)
        if (loaded.data.image) {
          setImage(loaded.data.image)
        }
      }
    }
  }, [projectId])

  useEffect(() => {
    if (image && imageRef.current) {
      if (cropper) {
        cropper.destroy()
      }
      const newCropper = new Cropper(imageRef.current, {
        aspectRatio: NaN,
        autoCropArea: 0.9,
        responsive: true,
        guides: true,
        grid: true,
      })
      setCropper(newCropper)
    }
  }, [image])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCrop = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas()
      setImage(canvas.toDataURL())
      cropper.destroy()
      setCropper(null)
    }
  }

  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a')
      link.href = image
      link.download = `${projectName}.png`
      link.click()
    }
  }

  const handleSave = () => {
    const newProject = project || projectStorage.createNewProject(projectName, 'photo')
    newProject.name = projectName
    newProject.data = { image }
    projectStorage.saveProject(newProject)
    setProject(newProject)
    alert('Project saved!')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Gov Photo Pro</h1>
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
              disabled={!image}
              className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas area */}
          <div className="lg:col-span-3">
            <div className="glass rounded-xl p-4 mb-4 flex items-center gap-4">
              {!image ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 h-96 md:h-full glass-dark rounded-lg border-2 border-dashed border-primary/50 flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                >
                  <div className="text-center">
                    <Plus size={48} className="mx-auto mb-2 text-primary/50" />
                    <p className="text-foreground/60">Click to upload an image</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 max-h-96 md:max-h-[600px] overflow-auto">
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Editable"
                    className="max-w-full"
                    style={{ maxHeight: '600px' }}
                  />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {image && cropper && (
              <button
                onClick={handleCrop}
                className="w-full px-4 py-2 bg-accent rounded-lg hover:bg-accent/80 transition-colors font-semibold"
              >
                Apply Crop
              </button>
            )}
          </div>

          {/* Tools panel */}
          <div className="glass rounded-xl p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">Tools</h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setImage(null)
                  setCropper(null)
                }}
                className="w-full px-3 py-2 bg-primary/20 rounded-lg hover:bg-primary/40 transition-colors text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors text-sm"
              >
                New Image
              </button>
              {image && (
                <button
                  onClick={handleCrop}
                  className="w-full px-3 py-2 bg-accent/20 rounded-lg hover:bg-accent/40 transition-colors text-sm"
                >
                  Crop
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
