import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[var(--z-modal)] p-4"
      onClick={onClose}
    >
      <div
        className={`
          ${sizeStyles[size]}
          w-full
          bg-[var(--color-surface)]
          rounded-[var(--radius-lg)]
          shadow-lg
          max-h-[90vh]
          overflow-y-auto
          flex flex-col
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-separator)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="border-t border-[var(--color-separator)] p-4 flex gap-2 justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
