import { Icon } from './Icon'

type StatCardProps = {
  label: string
  value: string
  change: string
  positive?: boolean
  accent?: boolean
}

export function StatCard({ label, value, change, positive = true }: StatCardProps) {
  return (
    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</p>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md border ${
            positive
              ? 'border-[var(--color-positive)]/25 bg-[var(--color-positive)]/15 text-[var(--color-positive)]'
              : 'border-[var(--color-negative)]/25 bg-[var(--color-negative)]/15 text-[var(--color-negative)]'
          }`}
          aria-hidden="true"
        >
          <Icon name={positive ? 'arrowUp' : 'arrowDown'} size={12} />
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-text)] tabular-nums sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        <span
          className={`font-semibold ${
            positive ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
          }`}
        >
          {change}
        </span>{' '}
        vs last month
      </p>
    </article>
  )
}
