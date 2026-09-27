import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExpenseTable } from '../components/ExpenseTable'
import { Icon } from '../components/Icon'
import { PageHeader } from '../components/PageHeader'
import type { Expense, ExpenseInput, CategoryOption } from '../types/finance'
import { EmptyState, ErrorState, TableSkeleton } from '../components/AsyncState'
import { deleteCategory, getCategories } from '../services/categoryService'
import { getApiErrorMessage } from '../services/api'
import { Button } from '../components/ui/Button'

export function Expenses({
  expenses,
  loading,
  loadError,
  onRetry,
  onUpdate,
  onDelete,
}: {
  expenses: Expense[]
  loading: boolean
  loadError?: string
  onRetry?: () => void
  onUpdate: (id: string, expense: ExpenseInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [month, setMonth] = useState('All months')
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [categoryError, setCategoryError] = useState('')
  const [deletingCategoryId, setDeletingCategoryId] = useState('')

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((requestError) => setCategoryError(getApiErrorMessage(requestError)))
  }, [])

  const filteredExpenses = useMemo(
    () =>
      expenses
        .filter(
          (expense) =>
            (expense.description ?? '').toLowerCase().includes(search.toLowerCase()) &&
            (category === 'All categories' || expense.category === category) &&
            (month === 'All months' || expense.date.startsWith(month))
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, search, category, month]
  )

  const months = [...new Set(expenses.map((expense) => expense.date.slice(0, 7)))].sort().reverse()

  const removeCategory = async (categoryOption: CategoryOption) => {
    if (
      !window.confirm(
        `Delete the ${categoryOption.name} category? Existing expenses will be moved to Other.`
      )
    )
      return
    setDeletingCategoryId(categoryOption.id)
    setCategoryError('')
    try {
      await deleteCategory(categoryOption.id)
      setCategories(await getCategories())
      if (category === categoryOption.name) setCategory('All categories')
      await onRetry?.()
    } catch (requestError) {
      setCategoryError(getApiErrorMessage(requestError))
    } finally {
      setDeletingCategoryId('')
    }
  }

  const headerActions = (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="secondary"
        onClick={() => {
          setCategoryError('')
          setCategoryModalOpen(true)
        }}
        type="button"
      >
        Manage categories
      </Button>
      <Link
        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
        to="/expenses/new"
      >
        <Icon name="plus" size={16} />
        <span>Add expense</span>
      </Link>
    </div>
  )

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow="Transactions / ledger"
          title="Expenses"
          description="Loading your expenses..."
        />
        <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <TableSkeleton columns={6} />
        </section>
      </>
    )
  }

  if (loadError) {
    return (
      <>
        <PageHeader
          eyebrow="Transactions / ledger"
          title="Expenses"
          description="Your expense history."
        />
        <ErrorState
          title="Unable to load expenses. Try again."
          description={loadError}
          action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined}
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Transactions / ledger"
        title="Expenses"
        description={`${expenses.length} entries, sorted newest first.`}
        action={headerActions}
      />

      {!expenses.length ? (
        <EmptyState
          title="No expenses yet"
          description="Add your first expense to start tracking your spending."
          action={() => window.location.assign('/expenses/new')}
        />
      ) : (
        <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors">
          {/* Search and Filters Bar matching reference */}
          <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <Icon name="search" size={16} />
              </span>
              <input
                className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 pl-10 pr-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search descriptions..."
                type="search"
                value={search}
              />
            </div>

            <div className="flex flex-wrap gap-2.5">
              <select
                className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 px-3.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-accent)] cursor-pointer"
                onChange={(event) => setCategory(event.target.value)}
                value={category}
              >
                <option>All categories</option>
                {categories.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>

              <select
                className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 px-3.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-accent)] cursor-pointer"
                onChange={(event) => setMonth(event.target.value)}
                value={month}
              >
                <option>All months</option>
                {months.map((item) => (
                  <option key={item} value={item}>
                    {new Date(`${item}-02`).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ExpenseTable
            emptyTitle="No matching expenses"
            expenses={filteredExpenses}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </section>
      )}

      {/* Category Management Modal */}
      {categoryModalOpen && (
        <div
          aria-labelledby="manage-categories-title"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-5 backdrop-blur-sm"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Expense setup
                </p>
                <h2 className="text-lg font-semibold text-[var(--color-text)]" id="manage-categories-title">
                  Manage categories
                </h2>
              </div>
              <button
                aria-label="Close"
                className="rounded-md p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                onClick={() => setCategoryModalOpen(false)}
                type="button"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {categoryError && (
              <p
                className="mb-4 rounded-lg border border-[var(--color-negative)]/30 bg-[var(--color-negative)]/10 px-3 py-2 text-xs text-[var(--color-negative)]"
                role="alert"
              >
                {categoryError}
              </p>
            )}

            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {categories.map((item) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 px-3.5 py-2.5"
                  key={item.id}
                >
                  <span className="text-sm font-medium text-[var(--color-text)]">{item.name}</span>
                  <button
                    aria-label={`Delete ${item.name} category`}
                    className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-negative)]/15 hover:text-[var(--color-negative)] disabled:cursor-wait disabled:opacity-50 transition-colors cursor-pointer"
                    disabled={deletingCategoryId === item.id}
                    onClick={() => void removeCategory(item)}
                    type="button"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              ))}
              {!categories.length && (
                <p className="py-4 text-center text-sm text-[var(--color-text-muted)]">
                  No categories available.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setCategoryModalOpen(false)}
                size="sm"
                type="button"
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
