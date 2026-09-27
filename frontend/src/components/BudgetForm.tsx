import { useEffect, useState } from 'react'
import type { Budget, BudgetInput, CategoryOption } from '../types/finance'
import { getCategories } from '../services/categoryService'
import { getApiErrorMessage } from '../services/api'

type BudgetFormProps = {
  initialBudget?: Budget
  onSubmit: (input: BudgetInput) => Promise<void>
  onCancel: () => void
}

export function BudgetForm({ initialBudget, onSubmit, onCancel }: BudgetFormProps) {
  const [form, setForm] = useState<BudgetInput>(
    initialBudget
      ? {
          amount: initialBudget.amount,
          categoryId: initialBudget.categoryId,
          month: initialBudget.month,
        }
      : {
          amount: 0,
          categoryId: '',
          month: new Date().toISOString().slice(0, 7),
        }
  )
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((requestError) => setError(getApiErrorMessage(requestError)))
  }, [])

  const update = <K extends keyof BudgetInput>(key: K, value: BudgetInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.amount <= 0) return setError('Budget amount must be greater than ₹0.')
    if (!form.categoryId) return setError('Choose a category before saving.')
    setError('')
    setSaving(true)
    try {
      await onSubmit(form)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      className="space-y-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-lg transition-colors"
      onSubmit={submit}
    >
      {error && (
        <p
          className="rounded-lg border border-[var(--color-negative)]/30 bg-[var(--color-negative)]/10 px-4 py-3 text-sm text-[var(--color-negative)]"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="field-label">
          <span>
            Monthly limit <span className="text-[var(--color-text-muted)] font-normal">INR</span>
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              ₹
            </span>
            <input
              className="field-input pl-8 text-base font-semibold tabular-nums"
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
        <label className="field-label">
          Category
          <select
            className="field-input"
            disabled={!categories.length}
            onChange={(event) => update('categoryId', event.target.value)}
            required
            value={form.categoryId}
          >
            <option disabled value="">
              {categories.length ? 'Select category' : 'Loading categories...'}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Month
          <input
            className="field-input"
            onChange={(event) => update('month', event.target.value)}
            required
            type="month"
            value={form.month}
          />
        </label>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:brightness-110 disabled:cursor-wait disabled:opacity-60 cursor-pointer transition"
          disabled={saving}
          type="submit"
        >
          {saving ? 'Saving...' : initialBudget ? 'Update budget' : 'Create budget'}
        </button>
        <button
          className="rounded-lg border border-[var(--color-border)] bg-transparent px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)] cursor-pointer transition"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}