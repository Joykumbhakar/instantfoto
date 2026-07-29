import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[var(--radius-lg)] transition-all whitespace-nowrap';

  const sizeStyles = {
    sm: 'px-3 py-2 text-xs h-8',
    md: 'px-4 py-2 text-sm h-9',
    lg: 'px-6 py-3 text-base h-12',
  };

  const variantStyles = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:opacity-80 disabled:opacity-50',
    secondary: 'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-tertiary)] active:opacity-80 disabled:opacity-50',
    tertiary: 'text-[var(--color-primary)] hover:bg-[var(--color-background-secondary)] active:opacity-80 disabled:opacity-50',
    destructive: 'bg-[var(--color-accent)] text-white hover:opacity-90 active:opacity-80 disabled:opacity-50',
  };

  return (
    <button
      disabled={loading || disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="animate-spin mr-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="15.7" strokeDashoffset="0" opacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="2" />
          </svg>
        </span>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
