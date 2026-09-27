import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Expense, ExpenseCategory, ExpenseInput } from '../types/finance'
import { createCategory, getCategories } from '../services/categoryService'
import { getApiErrorMessage } from '../services/api'
import { Icon } from './Icon'

const paymentMethods = ['Visa •••• 4242', 'Bank transfer', 'Apple Pay', 'Cash']

type ExpenseFormProps = {
  initialExpense?: Expense
  onSubmit: (expense: ExpenseInput) => void | Promise<void>
  onCancel?: () => void
}

export function ExpenseForm({ initialExpense, onSubmit, onCancel }: ExpenseFormProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<ExpenseInput>(
    initialExpense
      ? { ...initialExpense }
      : {
          amount: 0,
          categoryId: '',
          category: '' as ExpenseCategory,
          date: new Date().toISOString().slice(0, 10),
          description: '',
          paymentMethod: paymentMethods[0],
        }
  )
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = <K extends keyof ExpenseInput>(key: K, value: ExpenseInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }))
  const description = form.description || ''

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((requestError) => setError(getApiErrorMessage(requestError)))
      .finally(() => setCategoriesLoading(false))
  }, [])

  const selectCategory = (categoryId: string) => {
    const category = categories.find((item) => item.id === categoryId)
    update('categoryId', categoryId)
    update('category', category?.name)
  }

  const submitCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCategoryError('')
    setCreatingCategory(true)
    try {
      const created = await createCategory(newCategoryName.trim())
      const refreshed = await getCategories()
      setCategories(refreshed)
      setForm((current) => ({ ...current, categoryId: created.id, category: created.name }))
      setNewCategoryName('')
      setCategoryModalOpen(false)
    } catch (requestError) {
      setCategoryError(getApiErrorMessage(requestError))
    } finally {
      setCreatingCategory(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.amount <= 0) return setError('Amount must be greater than ₹0.')
    if (!form.categoryId) return setError('Choose a category before saving.')
    if (!form.date) return setError('Choose a date before saving.')
    if (description.length > 120) return setError('Description must be 120 characters or fewer.')
    setError('')
    setSubmitting(true)
    try {
      await onSubmit(form)
      if (!initialExpense) navigate('/expenses')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save expense.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <form
        className="max-w-2xl space-y-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-lg sm:p-7 transition-colors"
        onSubmit={handleSubmit}
      >
        {error && (
          <p
            className="rounded-lg border border-[var(--color-negative)]/30 bg-[var(--color-negative)]/10 px-4 py-3 text-sm text-[var(--color-negative)]"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field-label">
            <span>
              Amount <span className="text-[var(--color-text-muted)] font-normal">INR</span>
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                ₹
              </span>
              <input
                className="field-input pl-8 text-lg font-semibold tabular-nums"
                min="0.01"
                onChange={(event) => update('amount', Number(event.target.value))}
                placeholder="0.00"
                required
                step="0.01"
                type="number"
                value={form.amount || ''}
              />
            </div>
          </label>

          <div className="field-label">
            <span>Category</span>
            <div className="flex gap-2">
              <select
                className="field-input min-w-0 flex-1"
                disabled={categoriesLoading}
                onChange={(event) => selectCategory(event.target.value)}
                required
                value={form.categoryId}
              >
                <option disabled value="">
                  {categoriesLoading ? 'Loading categories...' : 'Select category'}
                </option>
                {categories.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <button
                aria-label="Create new category"
                className="shrink-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3 text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] cursor-pointer transition-colors"
                onClick={() => {
                  setCategoryError('')
                  setCategoryModalOpen(true)
                }}
                type="button"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <label className="field-label">
          <span>
            Description{' '}
            <span className="text-[var(--color-text-muted)] font-normal">{description.length}/120</span>
          </span>
          <input
            className="field-input"
            maxLength={120}
            onChange={(event) => update('description', event.target.value)}
            placeholder="What did you spend on?"
            type="text"
            value={description}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field-label">
            Date
            <input
              className="field-input"
              onChange={(event) => update('date', event.target.value)}
              required
              type="date"
              value={form.date}
            />
          </label>
          <label className="field-label">
            Payment method
            <select
              className="field-input"
              onChange={(event) => update('paymentMethod', event.target.value)}
              value={form.paymentMethod}
            >
              {paymentMethods.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:brightness-110 disabled:cursor-wait disabled:opacity-60 cursor-pointer transition"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Saving...' : initialExpense ? 'Update expense' : 'Save expense'}
          </button>
          {onCancel && (
            <button
              className="rounded-lg border border-[var(--color-border)] bg-transparent px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)] cursor-pointer transition"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {categoryModalOpen && (
        <div
          aria-labelledby="create-category-title"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-5 backdrop-blur-sm"
          role="dialog"
        >
          <div className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  Expense setup
                </p>
                <h2 className="text-lg font-semibold text-[var(--color-text)]" id="create-category-title">
                  Create new category
                </h2>
              </div>
              <button
                aria-label="Close"
                className="rounded-lg p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                onClick={() => setCategoryModalOpen(false)}
                type="button"
              >
                <Icon name="close" size={16} />
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
            <form className="space-y-4" onSubmit={submitCategory}>
              <label className="field-label">
                Category name
                <input
                  autoFocus
                  className="field-input"
                  maxLength={50}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  placeholder="e.g. Travel, Electronics"
                  required
                  type="text"
                  value={newCategoryName}
                />
              </label>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)] cursor-pointer transition"
                  onClick={() => setCategoryModalOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-medium text-white shadow-sm hover:brightness-110 disabled:opacity-60 cursor-pointer transition"
                  disabled={creatingCategory}
                  type="submit"
                >
                  {creatingCategory ? 'Creating...' : 'Create category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
