import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  elevated?: boolean
}

export function Card({ children, elevated = false, className = '', ...props }: CardProps) {
  return (
    <article
      className={`rounded-xl border border-[var(--color-border)] ${
        elevated ? 'bg-[var(--color-surface-elevated)]' : 'bg-[var(--color-surface)]'
      } p-5 sm:p-6 transition-colors ${className}`}
      {...props}
    >
      {children}
    </article>
  )
}
