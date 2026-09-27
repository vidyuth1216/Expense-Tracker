import type { HTMLAttributes, ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'positive' | 'negative' | 'warning' | 'accent' | 'lavender'
  children: ReactNode
}

export function Badge({
  variant = 'neutral',
  children,
  className = '',
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral:
      'border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]',
    positive:
      'border border-[var(--color-positive)]/25 bg-[var(--color-positive)]/15 text-[var(--color-positive)]',
    negative:
      'border border-[var(--color-negative)]/25 bg-[var(--color-negative)]/15 text-[var(--color-negative)]',
    warning:
      'border border-[var(--color-warning)]/25 bg-[var(--color-warning)]/15 text-[var(--color-warning)]',
    accent:
      'border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/15 text-[var(--color-accent)]',
    lavender:
      'border border-[#6F61C0]/30 bg-[#35324D] text-[#C9C6E8]',
  }[variant]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
