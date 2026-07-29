'use client';

import React, { useState } from 'react';
import { useEditor } from '@/lib/editorContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/States';

interface Color {
  id: string;
  hex: string;
  rgb: string;
  hsl: string;
  name: string;
}

export function ColorStudio() {
  const { addLayer } = useEditor();
  const [colors, setColors] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [colorInput, setColorInput] = useState('#007AFF');
  const [showGradient, setShowGradient] = useState(false);
  const [gradientColor1, setGradientColor1] = useState('#007AFF');
  const [gradientColor2, setGradientColor2] = useState('#5AC8FA');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 'rgb(0, 0, 0)';
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 'hsl(0, 0%, 0%)';

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const addColor = () => {
    if (!colorInput) return;
    
    const newColor: Color = {
      id: Date.now().toString(),
      hex: colorInput,
      rgb: hexToRgb(colorInput),
      hsl: hexToHsl(colorInput),
      name: `Color ${colors.length + 1}`,
    };

    setColors([...colors, newColor]);
    addLayer({
      name: newColor.name,
      type: 'color',
      visible: true,
      locked: false,
      data: { hex: colorInput, rgb: newColor.rgb, hsl: newColor.hsl },
    });
  };

  const removeColor = (id: string) => {
    setColors(colors.filter((c) => c.id !== id));
  };

  const exportPalette = () => {
    const palette = colors.map((c) => `${c.hex}: ${c.rgb}`).join('\n');
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(palette)}`);
    element.setAttribute('download', 'color-palette.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-2xl space-y-4 p-4">
      {/* Color Picker */}
      <Card>
        <CardHeader title="Create Color" />
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <input
                type="color"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                className="w-16 h-10 rounded-[var(--radius-lg)] cursor-pointer"
              />
            </div>
            <Input
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="#007AFF"
              className="flex-1"
            />
            <Button onClick={addColor} className="px-4">
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Color Preview */}
      {colors.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {colors.map((color) => (
            <Card
              key={color.id}
              className="overflow-hidden cursor-pointer"
              onClick={() => setSelectedColor(color.id)}
            >
              <div
                className="h-20 rounded-[var(--radius-lg)] mb-3"
                style={{ backgroundColor: color.hex }}
              />
              <CardContent className="space-y-2">
                <p className="text-sm font-mono font-medium text-[var(--color-text-primary)]">
                  {color.hex}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] font-mono">
                  {color.rgb}
                </p>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeColor(color.id);
                  }}
                  className="w-full"
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Gradient Generator */}
      <Card>
        <CardHeader title="Gradient Generator" />
        <CardContent className="space-y-3">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs font-medium text-[var(--color-text-primary)] mb-2 block">
                From
              </label>
              <input
                type="color"
                value={gradientColor1}
                onChange={(e) => setGradientColor1(e.target.value)}
                className="w-full h-10 rounded-[var(--radius-lg)] cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-[var(--color-text-primary)] mb-2 block">
                To
              </label>
              <input
                type="color"
                value={gradientColor2}
                onChange={(e) => setGradientColor2(e.target.value)}
                className="w-full h-10 rounded-[var(--radius-lg)] cursor-pointer"
              />
            </div>
          </div>
          <div
            className="h-20 rounded-[var(--radius-lg)]"
            style={{
              background: `linear-gradient(135deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`,
            }}
          />
          <Button
            onClick={() => {
              addLayer({
                name: 'Gradient',
                type: 'color',
                visible: true,
                locked: false,
                data: { 
                  gradient: `linear-gradient(135deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`,
                  color1: gradientColor1,
                  color2: gradientColor2,
                },
              });
            }}
            className="w-full"
          >
            Add Gradient to Layers
          </Button>
        </CardContent>
      </Card>

      {/* Export */}
      {colors.length > 0 && (
        <Button
          variant="secondary"
          onClick={exportPalette}
          className="w-full"
        >
          Export Palette
        </Button>
      )}

      {/* Empty State */}
      {colors.length === 0 && (
        <EmptyState
          icon={<span className="text-4xl">🎨</span>}
          title="Create Your Palette"
          description="Use the color picker to add colors and create beautiful gradients."
        />
      )}
    </div>
  );
}
