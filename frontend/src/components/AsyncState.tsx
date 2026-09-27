type StateMessageProps = {
  title: string
  description: string
  action?: { label: string; onClick: () => void } | (() => void)
}

export function ErrorState({
  title = 'Unable to load data. Try again.',
  description = 'We could not retrieve this information right now.',
  action,
}: Partial<StateMessageProps>) {
  const actionDetails = typeof action === 'function' ? { label: 'Try again', onClick: action } : action
  return (
    <div className="rounded-xl border border-[var(--color-negative)]/30 bg-[var(--color-surface)] px-5 py-12 text-center">
      <p className="text-base font-semibold text-[var(--color-negative)]">{title}</p>
      <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{description}</p>
      {actionDetails && (
        <button
          className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-2 text-xs font-medium text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] cursor-pointer transition-colors"
          onClick={actionDetails.onClick}
          type="button"
        >
          {actionDetails.label}
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, description, action }: StateMessageProps) {
  const actionDetails = typeof action === 'function' ? { label: 'Try again', onClick: action } : action
  return (
    <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/50 px-5 py-12 text-center">
      <p className="text-base font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{description}</p>
      {actionDetails && (
        <button
          className="mt-4 rounded-lg bg-[var(--color-nav-active-bg)] px-4 py-2 text-xs font-medium text-white shadow-sm hover:brightness-110 cursor-pointer transition"
          onClick={actionDetails.onClick}
          type="button"
        >
          {actionDetails.label}
        </button>
      )}
    </div>
  )
}

export function TableSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div aria-label="Loading records" className="space-y-3 p-5" role="status">
      {Array.from({ length: 5 }, (_, row) => (
        <div className="grid gap-4 sm:grid-cols-5" key={row}>
          {Array.from({ length: columns }, (_, column) => (
            <div
              className="h-5 animate-pulse rounded bg-[var(--color-surface-secondary)]"
              key={column}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton({ label = 'Loading dashboard' }: { label?: string } = {}) {
  return (
    <div aria-label={label} className="space-y-5" role="status">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            className="h-36 animate-pulse rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
            key={index}
          />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]" />
        <div className="h-72 animate-pulse rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]" />
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]" />
    </div>
  )
}
