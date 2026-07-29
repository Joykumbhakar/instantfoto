'use client';

import React, { useEffect, useState } from 'react';
import { useEditor } from '@/lib/editorContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { EmptyState, LoadingState } from '@/components/ui/States';

export default function EditorPage() {
  const { currentProject, createProject, setState } = useEditor();
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleCreateProject = () => {
    if (projectName.trim()) {
      setState('loading');
      setTimeout(() => {
        createProject(projectName, 'photo');
        setProjectName('');
        setShowNewProject(false);
        setState('success');
      }, 300);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--color-background)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-separator)]">
        <h1 className="text-base font-semibold text-[var(--color-text-primary)]">
          Design Studio Suite
        </h1>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex items-center justify-center px-4">
        {!currentProject ? (
          showNewProject ? (
            <Card className="w-full max-w-xs">
              <CardHeader title="New Project" />
              <CardContent>
                <Input
                  label="Project Name"
                  placeholder="My Design"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                  autoFocus
                />
              </CardContent>
              <div className="px-4 pb-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setShowNewProject(false);
                    setProjectName('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  size="md"
                  onClick={handleCreateProject}
                  disabled={!projectName.trim()}
                  className="flex-1"
                >
                  Create
                </Button>
              </div>
            </Card>
          ) : (
            <EmptyState
              title="No Project Open"
              description="Create a new project to start designing."
              action={{
                label: 'Create New Project',
                onClick: () => setShowNewProject(true),
              }}
            />
          )
        ) : (
          <div className="text-center">
            <p className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Welcome to {currentProject.name}
            </p>
            <p className="text-[var(--color-text-secondary)]">
              Select a mode from the toolbar to start editing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
