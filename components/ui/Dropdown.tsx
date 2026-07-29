import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  icon?: React.ReactNode;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
}

export function Dropdown({ trigger, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        triggerRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-lg border border-[var(--color-separator)] overflow-hidden z-[var(--z-dropdown)]"
        >
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2 text-left text-sm font-medium transition-colors flex items-center gap-2
                  ${item.variant === 'destructive'
                    ? 'text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10'
                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]'
                  }
                `}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
