import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-[var(--color-surface-secondary)] border border-[var(--color-border)]',
    outlined: 'border border-[var(--color-border)] bg-transparent',
    elevated: 'bg-[var(--color-surface)] shadow-[var(--shadow-md)]',
  };

  return (
    <div
      className={`
        rounded-[var(--radius-lg)]
        p-4
        ${variantStyles[variant]}
        transition-all
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  children,
  className = '',
  ...props
}: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {title && (
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({
  children,
  className = '',
  ...props
}: CardContentProps) {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({
  children,
  className = '',
  ...props
}: CardFooterProps) {
  return (
    <div
      className={`mt-4 pt-4 border-t border-[var(--color-separator)] flex gap-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
