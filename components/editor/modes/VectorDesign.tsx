'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useEditor } from '@/lib/editorContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { EmptyState, Progress } from '@/components/ui/States';

interface Vector {
  id: string;
  type: 'rectangle' | 'circle' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
}

export function VectorDesign() {
  const { addLayer, progress, setProgress, state, setState } = useEditor();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vectors, setVectors] = useState<Vector[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shapeColor, setShapeColor] = useState('#007AFF');
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    drawCanvas();
  }, [vectors, selectedId]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw vectors
    vectors.forEach((vector) => {
      ctx.fillStyle = vector.color;

      if (vector.type === 'rectangle') {
        ctx.fillRect(vector.x, vector.y, vector.width, vector.height);
        if (selectedId === vector.id) {
          ctx.strokeStyle = '#007AFF';
          ctx.lineWidth = 2;
          ctx.strokeRect(vector.x, vector.y, vector.width, vector.height);
        }
      } else if (vector.type === 'circle') {
        ctx.beginPath();
        ctx.arc(
          vector.x + vector.width / 2,
          vector.y + vector.height / 2,
          vector.width / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        if (selectedId === vector.id) {
          ctx.strokeStyle = '#007AFF';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (vector.type === 'text' && vector.text) {
        ctx.fillStyle = vector.color;
        ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(vector.text, vector.x, vector.y);
      }
    });
  };

  const addRectangle = () => {
    setState('loading');
    setTimeout(() => {
      const newVector: Vector = {
        id: Date.now().toString(),
        type: 'rectangle',
        x: Math.random() * 300,
        y: Math.random() * 200,
        width: 80,
        height: 60,
        color: shapeColor,
      };
      setVectors([...vectors, newVector]);
      addLayer({
        name: 'Rectangle',
        type: 'shape',
        visible: true,
        locked: false,
        data: newVector,
      });
      setState('success');
    }, 200);
  };

  const addCircle = () => {
    setState('loading');
    setTimeout(() => {
      const newVector: Vector = {
        id: Date.now().toString(),
        type: 'circle',
        x: Math.random() * 300,
        y: Math.random() * 200,
        width: 80,
        height: 80,
        color: shapeColor,
      };
      setVectors([...vectors, newVector]);
      addLayer({
        name: 'Circle',
        type: 'shape',
        visible: true,
        locked: false,
        data: newVector,
      });
      setState('success');
    }, 200);
  };

  const addText = () => {
    if (!textInput.trim()) return;

    setState('loading');
    setTimeout(() => {
      const newVector: Vector = {
        id: Date.now().toString(),
        type: 'text',
        x: 50,
        y: 50,
        width: 0,
        height: 0,
        color: shapeColor,
        text: textInput,
      };
      setVectors([...vectors, newVector]);
      addLayer({
        name: 'Text',
        type: 'text',
        visible: true,
        locked: false,
        data: newVector,
      });
      setTextInput('');
      setState('success');
    }, 200);
  };

  const deleteVector = (id: string) => {
    setVectors(vectors.filter((v) => v.id !== id));
  };

  const exportSvg = () => {
    setState('loading');
    setTimeout(() => {
      const svgContent = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="white"/>
          ${vectors
            .map((v) => {
              if (v.type === 'rectangle') {
                return `<rect x="${v.x}" y="${v.y}" width="${v.width}" height="${v.height}" fill="${v.color}"/>`;
              } else if (v.type === 'circle') {
                return `<circle cx="${v.x + v.width / 2}" cy="${v.y + v.height / 2}" r="${v.width / 2}" fill="${v.color}"/>`;
              } else if (v.type === 'text') {
                return `<text x="${v.x}" y="${v.y}" font-family="system-ui" font-size="16" fill="${v.color}">${v.text}</text>`;
              }
            })
            .join('')}
        </svg>
      `;

      const element = document.createElement('a');
      element.setAttribute('href', `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`);
      element.setAttribute('download', 'vector-design.svg');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setState('success');
    }, 300);
  };

  return (
    <div className="w-full max-w-2xl space-y-4 p-4">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full max-w-md border border-[var(--color-separator)] rounded-[var(--radius-lg)] bg-white cursor-crosshair"
      />

      {/* Controls */}
      <Card>
        <CardHeader title="Vector Tools" />
        <CardContent className="space-y-3">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs font-medium text-[var(--color-text-primary)] mb-2 block">
                Color
              </label>
              <input
                type="color"
                value={shapeColor}
                onChange={(e) => setShapeColor(e.target.value)}
                className="w-full h-9 rounded-[var(--radius-lg)] cursor-pointer"
              />
            </div>
            <Button size="md" onClick={addRectangle}>
              Rectangle
            </Button>
            <Button size="md" onClick={addCircle}>
              Circle
            </Button>
          </div>

          {/* Text input */}
          <div className="flex gap-2">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Add text"
              onKeyPress={(e) => e.key === 'Enter' && addText()}
            />
            <Button onClick={addText} className="px-4">
              Add Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shapes List */}
      {vectors.length > 0 && (
        <Card>
          <CardHeader title="Shapes" subtitle={`${vectors.length} shape(s)`} />
          <CardContent className="space-y-2">
            {vectors.map((vector) => (
              <div
                key={vector.id}
                className="flex items-center justify-between p-3 bg-[var(--color-background-secondary)] rounded-[var(--radius-md)] cursor-pointer hover:bg-[var(--color-background-tertiary)]"
                onClick={() => setSelectedId(vector.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: vector.color }}
                  />
                  <span className="text-sm font-medium capitalize">
                    {vector.type} {vector.text && `"${vector.text}"`}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteVector(vector.id);
                  }}
                  className="text-lg hover:opacity-70"
                >
                  ✕
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {vectors.length > 0 && (
          <>
            <Button
              variant="secondary"
              onClick={() => setVectors([])}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              onClick={exportSvg}
              className="flex-1"
            >
              Export SVG
            </Button>
          </>
        )}
      </div>

      {/* Empty State */}
      {vectors.length === 0 && (
        <EmptyState
          icon={<span className="text-4xl">✏️</span>}
          title="Create Vector Shapes"
          description="Use the tools above to add rectangles, circles, and text to your design."
        />
      )}
    </div>
  );
}
