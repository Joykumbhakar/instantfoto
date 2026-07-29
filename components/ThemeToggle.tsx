'use client';

import React, { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference or stored preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = storedTheme ? storedTheme === 'dark' : prefersDark;
    
    setIsDark(shouldBeDark);
    updateTheme(shouldBeDark);
  }, []);

  const updateTheme = (dark: boolean) => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    updateTheme(newIsDark);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2
        rounded-[var(--radius-lg)]
        bg-[var(--color-surface-secondary)]
        hover:bg-[var(--color-surface-hover)]
        transition-all
        text-[var(--color-text-primary)]
        flex items-center justify-center
      "
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8,8,0,1,1,1.11-9.19,1,1,0,0,0,1.32.06,1,1,0,0,0,.06-1.32A10,10,0,1,0,23,13a1,1,0,0,0-1.36-.06Z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,6A6,6,0,1,0,18,12,6,6,0,0,0,12,6Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,12,16Z" />
          <path d="M13,2h-2V0h2Z" />
          <path d="M20,3.86,21.86,2,23.29,3.43,21.43,5.29Z" />
          <path d="M22,11v2h2V11Z" />
          <path d="M21.86,20,20,21.86l-1.43-1.43L20.43,18.71Z" />
          <path d="M13,22h-2v2h2Z" />
          <path d="M3.86,20,5.29,21.43,3.43,23.29,2,21.86Z" />
          <path d="M2,13v-2H0v2Z" />
          <path d="M2,3.43,3.43,2,5.29,3.86,3.86,5.29Z" />
        </svg>
      )}
    </button>
  );
}
