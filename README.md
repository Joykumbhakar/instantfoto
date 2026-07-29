# Design Studio Suite

A unified design tool combining three powerful applications: Gov Photo Pro (photo editing), Chroma Studio (color palette design), and NexGen Design OS (vector graphics). All projects are stored locally using browser localStorage.

## Features

### Gov Photo Pro
- Professional photo editing with image cropping
- Real-time preview with Cropper.js
- Export images as PNG files
- Project save/load with localStorage

### Chroma Studio
- Create and manage color palettes
- Support for HEX and RGB color formats
- Gradient creation and preview
- Export palettes as CSS files
- Color copying to clipboard

### NexGen Design OS
- Vector design with Fabric.js canvas
- Add rectangles, circles, and text elements
- Drag, resize, and rotate objects
- Export designs as PNG files
- Project save/load

## Getting Started

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  ├── page.tsx              # Dashboard home page
  ├── photo-pro/
  │   └── page.tsx          # Photo editing tool
  ├── chroma-studio/
  │   └── page.tsx          # Color palette designer
  ├── nexgen-design/
  │   └── page.tsx          # Vector design tool
  ├── layout.tsx            # Root layout
  └── globals.css           # Global styles

components/
  └── Navigation.tsx        # Mobile drawer + desktop sidebar

lib/
  └── projectStorage.ts     # localStorage project management
```

## Data Storage

All projects are stored in the browser's localStorage with the key `design_studio_projects`. Each project contains:
- Unique ID
- Project name and type
- Tool-specific data (images, colors, gradients, canvas JSON)
- Creation and update timestamps

## Design System

- **Primary Color**: #4F46E5 (Indigo)
- **Secondary Color**: #06b6d4 (Cyan)
- **Accent Color**: #ec4899 (Pink)
- **Background**: #0a0a0a (Dark)
- **Typography**: Inter font family
- **Effects**: Glass morphism with backdrop blur

## Mobile Responsiveness

- **Mobile**: Drawer-based navigation (< 1024px)
- **Desktop**: Fixed sidebar navigation
- **Responsive Grid**: Adapts from 1 to 3 columns
- **Touch-friendly**: Optimized for 312px+ widths

## Building for Production

```bash
npm run build
npm run start
```

## Technologies

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Photo Editing**: Cropper.js
- **Vector Design**: Fabric.js
- **Icons**: Lucide React

## Browser Support

Works on all modern browsers supporting:
- ES2017+
- Canvas API
- localStorage
