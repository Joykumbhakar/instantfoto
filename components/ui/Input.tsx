import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Input({
  label,
  error,
  icon,
  size = 'md',
  className = '',
  disabled = false,
  ...props
}: InputProps) {
  const sizeStyles = {
    sm: 'px-3 py-2 text-xs h-8',
    md: 'px-3 py-2 text-sm h-9',
    lg: 'px-4 py-3 text-base h-11',
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-tertiary)]">
            {icon}
          </span>
        )}
        <input
          className={`
            w-full
            ${sizeStyles[size]}
            ${icon ? 'pl-10' : ''}
            rounded-[var(--radius-lg)]
            bg-[var(--color-surface-secondary)]
            border border-[var(--color-border)]
            text-[var(--color-text-primary)]
            placeholder-[var(--color-text-tertiary)]
            focus:outline-none
            focus:border-[var(--color-primary)]
            focus:ring-1
            focus:ring-[var(--color-primary)]
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-all
            ${error ? 'border-[var(--color-accent)]' : ''}
            ${className}
          `}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[var(--color-accent)] mt-1">{error}</p>
      )}
    </div>
  );
}
