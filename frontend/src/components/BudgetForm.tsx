import { useEffect, useState } from 'react'
import type { Budget, BudgetInput, CategoryOption } from '../types/finance'
import { getCategories } from '../services/categoryService'
import { getApiErrorMessage } from '../services/api'

type BudgetFormProps = { initialBudget?: Budget; onSubmit: (input: BudgetInput) => Promise<void>; onCancel: () => void }

export function BudgetForm({ initialBudget, onSubmit, onCancel }: BudgetFormProps) {
  const [form, setForm] = useState<BudgetInput>(initialBudget ? { amount: initialBudget.amount, categoryId: initialBudget.categoryId, month: initialBudget.month } : { amount: 0, categoryId: '', month: new Date().toISOString().slice(0, 7) })
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { getCategories().then(setCategories).catch((requestError) => setError(getApiErrorMessage(requestError))) }, [])

  const update = <K extends keyof BudgetInput>(key: K, value: BudgetInput[K]) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.amount <= 0) return setError('Budget amount must be greater than ₹0.')
    if (!form.categoryId) return setError('Choose a category before saving.')
    setError('')
    setSaving(true)
    try { await onSubmit(form) } catch (requestError) { setError(getApiErrorMessage(requestError)) } finally { setSaving(false) }
  }

  return <form className="space-y-5 rounded-2xl border border-white/8 bg-[#151818] p-5 sm:p-6" onSubmit={submit}>
    {error && <p className="rounded-xl border border-[#ff9b70]/30 bg-[#ff9b70]/10 px-4 py-3 text-sm text-[#ffb18f]" role="alert">{error}</p>}
    <div className="grid gap-5 sm:grid-cols-3">
      <label className="field-label">Monthly limit <span className="text-[#64736b]">INR</span><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d5f477]">₹</span><input className="field-input pl-8" min="0.01" onChange={(event) => update('amount', Number(event.target.value))} required step="0.01" type="number" value={form.amount || ''} /></div></label>
      <label className="field-label">Category<select className="field-input" disabled={!categories.length} onChange={(event) => update('categoryId', event.target.value)} required value={form.categoryId}><option disabled value="">{categories.length ? 'Select category' : 'Loading categories...'}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <label className="field-label">Month<input className="field-input" onChange={(event) => update('month', event.target.value)} required type="month" value={form.month} /></label>
    </div>
    <div className="flex gap-3"><button className="rounded-xl bg-[#d5f477] px-5 py-3 text-sm font-bold text-[#16210f] hover:bg-[#e3ff93] disabled:cursor-wait disabled:opacity-60" disabled={saving} type="submit">{saving ? 'Saving...' : initialBudget ? 'Update budget' : 'Create budget'}</button><button className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-[#aeb7b1] hover:border-white/20 hover:text-white" onClick={onCancel} type="button">Cancel</button></div>
  </form>
}