'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useEditor } from '@/lib/editorContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { EmptyState, Progress } from '@/components/ui/States';

export function PhotoEditor() {
  const {
    currentProject,
    addLayer,
    progress,
    setProgress,
    state,
    setState,
    error,
    setError,
  } = useEditor();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  useEffect(() => {
    drawCanvas();
  }, [image, crop, brightness, contrast, saturation]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState('loading');
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setProgress(percentComplete);
      }
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setCrop({ x: 0, y: 0, width: img.width, height: img.height });
        addLayer({
          name: 'Photo',
          type: 'image',
          visible: true,
          locked: false,
          data: { src: event.target?.result },
        });
        setState('success');
        setProgress(0);
      };
      img.onerror = () => {
        setError('Failed to load image');
        setState('error');
      };
      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setState('error');
    };

    reader.readAsDataURL(file);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setState('loading');
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'photo-edited.png';
      link.click();
      setState('success');
    }, 300);
  };

  if (!image) {
    return (
      <div className="w-full max-w-md p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <EmptyState
          icon={<span className="text-4xl">📷</span>}
          title="Upload a Photo"
          description="Import an image to start editing with brightness, contrast, and saturation controls."
          action={{
            label: 'Choose Image',
            onClick: () => fileInputRef.current?.click(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4 p-4">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full max-w-md border border-[var(--color-separator)] rounded-[var(--radius-lg)] bg-[var(--color-surface)]"
      />

      {/* Controls */}
      <Card>
        <CardHeader title="Photo Controls" />
        <CardContent className="space-y-4">
          {/* Brightness */}
          <div>
            <label className="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">
              Brightness: {brightness}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full h-2 bg-[var(--color-background-secondary)] rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
            />
          </div>

          {/* Contrast */}
          <div>
            <label className="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">
              Contrast: {contrast}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full h-2 bg-[var(--color-background-secondary)] rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
            />
          </div>

          {/* Saturation */}
          <div>
            <label className="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">
              Saturation: {saturation}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full h-2 bg-[var(--color-background-secondary)] rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
            />
          </div>

          {/* Progress */}
          {state === 'loading' && <Progress value={progress} max={100} label="Processing..." />}

          {/* Error */}
          {error && (
            <div className="p-3 bg-[var(--color-accent)] bg-opacity-10 border border-[var(--color-accent)] rounded-[var(--radius-lg)] text-sm text-[var(--color-accent)]">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          Change Image
        </Button>
        <Button
          onClick={exportImage}
          className="flex-1"
        >
          Export
        </Button>
      </div>
    </div>
  );
}
