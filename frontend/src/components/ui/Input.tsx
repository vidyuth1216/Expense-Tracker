import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftIcon, rightIcon, className = '', id, ...props },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="field-label">
            {label}
          </label>
          {hint && <span className="text-[11px] text-[var(--color-text-muted)]">{hint}</span>}
        </div>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 flex items-center text-[var(--color-text-muted)]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] ${
            leftIcon ? 'pl-9' : ''
          } ${rightIcon ? 'pr-9' : ''} ${
            error ? 'border-[var(--color-negative)] focus:border-[var(--color-negative)] focus:ring-[var(--color-negative)]' : ''
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 flex items-center text-[var(--color-text-muted)]">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-[var(--color-negative)]" role="alert">{error}</p>}
    </div>
  )
})
