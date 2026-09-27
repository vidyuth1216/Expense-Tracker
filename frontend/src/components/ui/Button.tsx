import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-180 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50'

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2 rounded-lg gap-2 min-h-[38px]',
    lg: 'text-sm font-semibold px-5 py-2.5 rounded-lg gap-2.5 min-h-[44px]',
  }[size]

  const variantStyles = {
    primary:
      'bg-[var(--color-primary)] text-white hover:brightness-110 active:brightness-95 shadow-sm',
    secondary:
      'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-secondary)]',
    destructive:
      'border border-[var(--color-negative)]/30 bg-[var(--color-negative)]/10 text-[var(--color-negative)] hover:bg-[var(--color-negative)]/20 active:bg-[var(--color-negative)]/25',
    ghost:
      'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]',
  }[variant]

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
