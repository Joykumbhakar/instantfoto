import React from 'react';
import { Button } from './Button';

/* Loading Skeleton */
export function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-12 bg-[var(--color-background-secondary)] rounded-[var(--radius-lg)] animate-pulse"
        />
      ))}
    </div>
  );
}

/* Progress Bar */
interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
}

export function Progress({ value, max = 100, label }: ProgressProps) {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {label}
          </span>
          <span className="text-xs text-[var(--color-text-tertiary)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* Empty State */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <div className="mb-4 text-[var(--color-text-tertiary)]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6 max-w-xs">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} size="md">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/* Error State */
interface ErrorStateProps {
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
}

export function ErrorState({
  title,
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-[var(--color-background-secondary)] rounded-[var(--radius-lg)]">
      <div className="mb-4 text-3xl">
        <svg className="w-12 h-12 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6 max-w-xs">
          {message}
        </p>
      )}
      {action && (
        <Button variant="secondary" onClick={action.onClick} size="md">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/* Not Found State */
interface NotFoundStateProps {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function NotFoundState({
  title = 'Page Not Found',
  description = 'The page you&apos;re looking for doesn&apos;t exist.',
  action,
}: NotFoundStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-6xl font-bold text-[var(--color-text-tertiary)] mb-4">
        404
      </div>
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
        {title}
      </h1>
      <p className="text-[var(--color-text-secondary)] text-center mb-8 max-w-md">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

/* Loading State with Spinner */
export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-4">
        <svg
          className="animate-spin w-8 h-8 text-[var(--color-primary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
    </div>
  );
}
