'use client';

import React from 'react';
import { useEditor } from '@/lib/editorContext';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';

export function EditorToolbar() {
  const { currentMode, setCurrentMode, currentProject } = useEditor();

  const modes: Array<{ id: 'photo' | 'color' | 'vector'; label: string; icon: string }> = [
    { id: 'photo', label: 'Photo', icon: '📷' },
    { id: 'color', label: 'Color', icon: '🎨' },
    { id: 'vector', label: 'Vector', icon: '✏️' },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-separator)] gap-2">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
          {currentProject?.name || 'Untitled'}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1 bg-[var(--color-background-secondary)] rounded-[var(--radius-md)] p-1">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setCurrentMode(mode.id)}
              className={`
                px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all
                ${currentMode === mode.id
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }
              `}
            >
              <span className="mr-1">{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>

        <ThemeToggle />
      </div>
    </div>
  );
}
