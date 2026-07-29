'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile drawer button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X size={24} className="text-foreground" />
        ) : (
          <Menu size={24} className="text-foreground" />
        )}
      </button>

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 w-64 h-screen glass-dark md:hidden transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="pt-20 px-4 space-y-4">
          <Link
            href="/"
            className="block px-4 py-3 rounded-lg hover:bg-primary/20 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/photo-pro"
            className="block px-4 py-3 rounded-lg hover:bg-primary/20 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Photo Pro
          </Link>
          <Link
            href="/chroma-studio"
            className="block px-4 py-3 rounded-lg hover:bg-primary/20 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Chroma Studio
          </Link>
          <Link
            href="/nexgen-design"
            className="block px-4 py-3 rounded-lg hover:bg-primary/20 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            NexGen Design
          </Link>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:w-64 md:h-screen md:glass-dark md:border-r md:border-primary/20">
        <nav className="pt-8 px-4 space-y-2">
          <Link href="/" className="block px-4 py-3 rounded-lg hover:bg-primary/20 transition-colors font-semibold">
            Design Studio
          </Link>
          <div className="pt-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/photo-pro"
              className="block px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm"
            >
              Photo Pro
            </Link>
            <Link
              href="/chroma-studio"
              className="block px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm"
            >
              Chroma Studio
            </Link>
            <Link
              href="/nexgen-design"
              className="block px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm"
            >
              NexGen Design
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
