'use client';

import React from 'react';
import { useEditor } from '@/lib/editorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';

export function LayersPanel() {
  const {
    currentProject,
    selectedLayerId,
    setSelectedLayerId,
    removeLayer,
    updateLayer,
  } = useEditor();

  if (!currentProject) {
    return (
      <Card>
        <CardHeader title="Layers" subtitle="No project loaded" />
        <CardContent>
          <EmptyState
            title="No layers yet"
            description="Create a new project to get started"
          />
        </CardContent>
      </Card>
    );
  }

  const layers = [...currentProject.layers].sort((a, b) => b.order - a.order);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Layers" subtitle={`${layers.length} layer(s)`} />
      
      <CardContent className="flex-1 overflow-y-auto space-y-2">
        {layers.length === 0 ? (
          <EmptyState title="No layers" description="Add layers to start editing" />
        ) : (
          layers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => setSelectedLayerId(layer.id)}
              className={`
                p-3 rounded-[var(--radius-md)] cursor-pointer transition-all
                ${selectedLayerId === layer.id
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-background-secondary)] hover:bg-[var(--color-background-tertiary)]'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateLayer(layer.id, { visible: !layer.visible });
                    }}
                    className="text-lg"
                  >
                    {layer.visible ? '👁️' : '🙈'}
                  </button>
                  <span className="text-sm font-medium truncate">{layer.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLayer(layer.id);
                  }}
                  className="text-xs px-2 py-1 rounded hover:opacity-70"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
