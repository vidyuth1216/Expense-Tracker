import { useEffect, useMemo, useState } from 'react'
import { BudgetForm } from '../components/BudgetForm'
import { EmptyState, ErrorState, TableSkeleton } from '../components/AsyncState'
import { Icon } from '../components/Icon'
import { PageHeader } from '../components/PageHeader'
import { createBudget, deleteBudget, getBudgets, updateBudget } from '../services/budgetService'
import { getApiErrorMessage } from '../services/api'
import { formatINR, type Budget, type BudgetInput } from '../types/finance'
import { Button } from '../components/ui/Button'

const currentMonth = new Date().toISOString().slice(0, 7)
const monthLabel = (month: string) =>
  new Date(`${month}-02`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

export function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [month, setMonth] = useState(currentMonth)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Budget>()

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setBudgets(await getBudgets())
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const visibleBudgets = useMemo(
    () => budgets.filter((budget) => budget.month === month),
    [budgets, month]
  )
  const knownMonths = [...new Set(budgets.map((budget) => budget.month))].sort().reverse()

  const save = async (input: BudgetInput) => {
    if (editing) await updateBudget(editing.id, input)
    else await createBudget(input)
    setShowForm(false)
    setEditing(undefined)
    await load()
  }

  const remove = async (budget: Budget) => {
    if (!window.confirm(`Delete the ${budget.category} budget for ${monthLabel(budget.month)}?`))
      return
    try {
      await deleteBudget(budget.id)
      await load()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    }
  }

  const headerAction = (
    <Button
      variant="primary"
      onClick={() => {
        setEditing(undefined)
        setShowForm(true)
      }}
      type="button"
    >
      <Icon name="plus" size={16} />
      <span>Add budget</span>
    </Button>
  )

  return (
    <>
      <PageHeader
        eyebrow="Planning / guardrails"
        title="Budgets"
        description="Set monthly limits and keep spending visible."
        action={headerAction}
      />

      {showForm && (
        <section className="mb-6">
          <BudgetForm
            initialBudget={editing}
            onCancel={() => {
              setShowForm(false)
              setEditing(undefined)
            }}
            onSubmit={save}
          />
        </section>
      )}

      {/* Month Filter Selector matching reference */}
      <div className="mb-6 space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-base font-semibold text-[var(--color-text)]">{monthLabel(month)}</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {visibleBudgets.length} category {visibleBudgets.length === 1 ? 'limit' : 'limits'}
            </p>
          </div>
        </div>

        <div className="relative">
          <select
            aria-label="Filter budgets by month"
            className="h-10 w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 pr-10 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-accent)] cursor-pointer"
            onChange={(event) => setMonth(event.target.value)}
            value={month}
          >
            <option value={currentMonth}>{monthLabel(currentMonth)}</option>
            {knownMonths
              .filter((item) => item !== currentMonth)
              .map((item) => (
                <option key={item} value={item}>
                  {monthLabel(item)}
                </option>
              ))}
          </select>
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            <Icon name="chevron" size={16} />
          </span>
        </div>
      </div>

      {loading ? (
        <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <TableSkeleton columns={4} />
        </section>
      ) : error ? (
        <ErrorState
          title="Unable to load budgets. Try again."
          description={error}
          action={{ label: 'Try again', onClick: load }}
        />
      ) : !visibleBudgets.length ? (
        <EmptyState
          title={`No budgets for ${monthLabel(month)}`}
          description="Create a category limit to start tracking your monthly spending."
          action={() => setShowForm(true)}
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleBudgets.map((budget) => (
            <BudgetCard
              budget={budget}
              key={budget.id}
              onDelete={remove}
              onEdit={(item) => {
                setEditing(item)
                setShowForm(true)
              }}
            />
          ))}
        </section>
      )}
    </>
  )
}

function BudgetCard({
  budget,
  onEdit,
  onDelete,
}: {
  budget: Budget
  onEdit: (budget: Budget) => void
  onDelete: (budget: Budget) => void
}) {
  const progress = Math.min(budget.progressPercentage, 100)
  const isOver = budget.isOverBudget

  return (
    <article
      className={`rounded-xl border p-5 transition-colors ${
        isOver
          ? 'border-[var(--color-negative)]/40 bg-[var(--color-surface)]'
          : 'border-[var(--color-positive)]/40 bg-[var(--color-surface)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-[var(--color-text)]">{budget.category}</p>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{monthLabel(budget.month)}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label={`Edit ${budget.category} budget`}
            className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
            onClick={() => onEdit(budget)}
            type="button"
          >
            <Icon name="edit" size={15} />
          </button>
          <button
            aria-label={`Delete ${budget.category} budget`}
            className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-negative)]/15 hover:text-[var(--color-negative)] transition-colors cursor-pointer"
            onClick={() => onDelete(budget)}
            type="button"
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tabular-nums text-[var(--color-text)]">
            {formatINR(budget.spent)}
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            spent of {formatINR(budget.amount)}
          </p>
        </div>
        <p
          className={`text-sm font-bold tabular-nums ${
            isOver ? 'text-[var(--color-negative)]' : 'text-[var(--color-positive)]'
          }`}
        >
          {budget.progressPercentage.toFixed(0)}%
        </p>
      </div>

      {/* Progress Track */}
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOver ? 'bg-[var(--color-negative)]' : 'bg-[var(--color-positive)]'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status indicator line */}
      <p
        className={`mt-3 text-sm ${
          isOver
            ? 'font-semibold text-[var(--color-negative)]'
            : 'font-medium text-[var(--color-text-secondary)]'
        }`}
      >
        {isOver
          ? `${formatINR(Math.abs(budget.remaining))} over budget`
          : `${formatINR(budget.remaining)} remaining`}
      </p>
    </article>
  )
}