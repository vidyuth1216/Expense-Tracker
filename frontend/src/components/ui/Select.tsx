import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react'
import { Icon } from '../Icon'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, className = '', id, children, ...props },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={selectId} className="field-label">
            {label}
          </label>
          {hint && <span className="text-[11px] text-[var(--color-text-muted)]">{hint}</span>}
        </div>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          ref={ref}
          className={`h-10 w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-3 pr-9 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? 'border-[var(--color-negative)]' : ''
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 flex items-center text-[var(--color-text-muted)]">
          <Icon name="chevron" size={15} />
        </span>
      </div>
      {error && <p className="text-xs text-[var(--color-negative)]" role="alert">{error}</p>}
    </div>
  )
})
