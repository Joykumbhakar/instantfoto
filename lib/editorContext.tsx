'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type EditorMode = 'photo' | 'color' | 'vector';
export type StateType = 'idle' | 'loading' | 'error' | 'empty' | 'success';

export interface Layer {
  id: string;
  name: string;
  type: 'image' | 'color' | 'shape' | 'text';
  visible: boolean;
  locked: boolean;
  data: any;
  order: number;
}

export interface EditorProject {
  id: string;
  name: string;
  layers: Layer[];
  mode: EditorMode;
  createdAt: number;
  updatedAt: number;
}

interface EditorContextType {
  // Project state
  currentProject: EditorProject | null;
  setCurrentProject: (project: EditorProject | null) => void;
  createProject: (name: string, mode: EditorMode) => EditorProject;
  saveProject: (project: EditorProject) => void;

  // Mode state
  currentMode: EditorMode;
  setCurrentMode: (mode: EditorMode) => void;

  // Layer management
  addLayer: (layer: Omit<Layer, 'id' | 'order'>) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;

  // UI state
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;

  // State management
  state: StateType;
  setState: (state: StateType) => void;
  error: string | null;
  setError: (error: string | null) => void;
  progress: number;
  setProgress: (progress: number) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState<EditorProject | null>(null);
  const [currentMode, setCurrentMode] = useState<EditorMode>('photo');
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [state, setState] = useState<StateType>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const createProject = useCallback((name: string, mode: EditorMode): EditorProject => {
    const project: EditorProject = {
      id: Date.now().toString(),
      name,
      mode,
      layers: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentProject(project);
    return project;
  }, []);

  const saveProject = useCallback((project: EditorProject) => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const existingIndex = projects.findIndex((p: EditorProject) => p.id === project.id);
    
    const updatedProject = {
      ...project,
      updatedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      projects[existingIndex] = updatedProject;
    } else {
      projects.push(updatedProject);
    }

    localStorage.setItem('projects', JSON.stringify(projects));
    setCurrentProject(updatedProject);
  }, []);

  const addLayer = useCallback((layer: Omit<Layer, 'id' | 'order'>) => {
    if (!currentProject) return;

    const newLayer: Layer = {
      ...layer,
      id: Date.now().toString(),
      order: currentProject.layers.length,
    };

    const updated = {
      ...currentProject,
      layers: [...currentProject.layers, newLayer],
    };
    setCurrentProject(updated);
    saveProject(updated);
  }, [currentProject, saveProject]);

  const removeLayer = useCallback((id: string) => {
    if (!currentProject) return;

    const updated = {
      ...currentProject,
      layers: currentProject.layers.filter((l) => l.id !== id),
    };
    setCurrentProject(updated);
    saveProject(updated);
  }, [currentProject, saveProject]);

  const updateLayer = useCallback((id: string, updates: Partial<Layer>) => {
    if (!currentProject) return;

    const updated = {
      ...currentProject,
      layers: currentProject.layers.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    };
    setCurrentProject(updated);
    saveProject(updated);
  }, [currentProject, saveProject]);

  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    if (!currentProject) return;

    const newLayers = [...currentProject.layers];
    const [removed] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, removed);

    const updated = {
      ...currentProject,
      layers: newLayers.map((l, i) => ({ ...l, order: i })),
    };
    setCurrentProject(updated);
    saveProject(updated);
  }, [currentProject, saveProject]);

  const value: EditorContextType = {
    currentProject,
    setCurrentProject,
    createProject,
    saveProject,
    currentMode,
    setCurrentMode,
    addLayer,
    removeLayer,
    updateLayer,
    reorderLayers,
    showSidebar,
    setShowSidebar,
    selectedLayerId,
    setSelectedLayerId,
    state,
    setState,
    error,
    setError,
    progress,
    setProgress,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}
