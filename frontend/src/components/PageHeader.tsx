import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { useAuth } from '../context/AuthContext'

type PageHeaderProps = { eyebrow?: string; title: string; description?: string; action?: ReactNode }

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-text)] sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{description}</p>
        )}
      </div>
      {action}
    </header>
  )
}

export function UserProfile() {
  const { user } = useAuth()
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME'
  return (
    <div className="hidden items-center gap-3 border-l border-[var(--color-border)] pl-5 sm:flex">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
        {initials}
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--color-text)]">{user?.name ?? 'Account'}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{user?.email ?? 'Personal account'}</p>
      </div>
      <Icon name="chevron" size={15} />
    </div>
  )
}

export function MonthPicker() {
  return (
    <button
      className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-border-strong)] transition-colors cursor-pointer"
      type="button"
    >
      September 2024 <Icon name="chevron" size={15} />
    </button>
  )
}
