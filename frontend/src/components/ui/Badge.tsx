import type { HTMLAttributes, ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'positive' | 'negative' | 'warning' | 'accent' | 'lavender' | 'teal' | 'coral'
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
      'border border-[var(--color-success)]/30 bg-[var(--color-success)]/15 text-[var(--color-success)]',
    negative:
      'border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/15 text-[var(--color-danger)]',
    warning:
      'border border-[var(--color-warning)]/25 bg-[var(--color-warning)]/15 text-[var(--color-warning)]',
    accent:
      'border border-[var(--color-primary)]/35 bg-[var(--color-primary)]/20 text-[var(--color-brand)]',
    lavender:
      'border border-[#554b73] bg-[#352f4a] text-[#d4cbef]',
    teal:
      'border border-[#38564b] bg-[#223932] text-[#93dac4]',
    coral:
      'border border-[#6b4752] bg-[#422932] text-[#e8abb6]',
  }[variant]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
