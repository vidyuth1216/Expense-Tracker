import { useState } from 'react'
import { Icon } from '../components/Icon'
import { IncomeForm } from '../components/IncomeForm'
import { IncomeTable } from '../components/IncomeTable'
import { PageHeader } from '../components/PageHeader'
import type { Income as IncomeRecord, IncomeInput } from '../types/finance'
import { EmptyState, ErrorState, TableSkeleton } from '../components/AsyncState'
import { Button } from '../components/ui/Button'
import { formatINR } from '../types/finance'

export function Income({
  incomes,
  loading,
  loadError,
  onRetry,
  onCreate,
  onUpdate,
  onDelete,
}: {
  incomes: IncomeRecord[]
  loading: boolean
  loadError?: string
  onRetry?: () => void
  onCreate: (income: IncomeInput) => Promise<void>
  onUpdate: (id: string, income: IncomeInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [showForm, setShowForm] = useState(false)
  const totalIncome = incomes.reduce((total, income) => total + income.amount, 0)
  const activeSourcesCount = new Set(incomes.map((income) => income.source)).size

  const headerAction = (
    <Button
      variant="primary"
      onClick={() => setShowForm((current) => !current)}
      type="button"
    >
      <Icon name="plus" size={16} />
      <span>{showForm ? 'Close form' : 'Add income'}</span>
    </Button>
  )

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow="Transactions / inflow"
          title="Income"
          description="Loading your income..."
        />
        <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <TableSkeleton columns={5} />
        </section>
      </>
    )
  }

  if (loadError) {
    return (
      <>
        <PageHeader
          eyebrow="Transactions / inflow"
          title="Income"
          description="Your income history."
        />
        <ErrorState
          title="Unable to load income. Try again."
          description={loadError}
          action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined}
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Transactions / inflow"
        title="Income"
        description={`${incomes.length} income entries, sorted newest first.`}
        action={headerAction}
      />

      {showForm && (
        <section className="mb-6">
          <IncomeForm
            onCancel={() => setShowForm(false)}
            onSubmit={async (income) => {
              await onCreate(income)
              setShowForm(false)
            }}
          />
        </section>
      )}

      {/* Top Metric Cards: Dominant Tracked Income and Active Sources */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2">
        {/* Tracked income card with prominent typography */}
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Tracked income</p>
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--color-positive)]/25 bg-[var(--color-positive)]/15 text-[var(--color-positive)]"
              aria-hidden="true"
            >
              <Icon name="arrowUp" size={12} />
            </span>
          </div>

          <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text)] tabular-nums sm:text-4xl">
            {formatINR(totalIncome)}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <p>
              <span className="font-semibold text-[var(--color-positive)]">
                {incomes.length} entries
              </span>{' '}
              vs last month
            </p>
            <span className="text-[var(--color-text-muted)]">↗ previous vs last month</span>
          </div>
        </article>

        {/* Income sources card */}
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Income sources</p>
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--color-positive)]/25 bg-[var(--color-positive)]/15 text-[var(--color-positive)]"
              aria-hidden="true"
            >
              <Icon name="arrowUp" size={12} />
            </span>
          </div>

          <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text)] tabular-nums sm:text-4xl">
            {activeSourcesCount} active
          </p>

          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-positive)]">
              From your income records
            </span>{' '}
            vs last month
          </p>
        </article>
      </section>

      {/* Income History Ledger */}
      {incomes.length ? (
        <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors">
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Income history</h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Your latest inflows</p>
          </div>
          <IncomeTable incomes={incomes} onDelete={onDelete} onUpdate={onUpdate} />
        </section>
      ) : (
        <EmptyState
          title="No income yet"
          description="Add your first income entry to start tracking your balance."
          action={() => setShowForm(true)}
        />
      )}
    </>
  )
}
