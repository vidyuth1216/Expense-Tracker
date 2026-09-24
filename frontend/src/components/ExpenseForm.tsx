import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Expense, ExpenseCategory, ExpenseInput } from '../types/finance'
import { createCategory, getCategories } from '../services/categoryService'
import { getApiErrorMessage } from '../services/api'

const paymentMethods = ['Visa •••• 4242', 'Bank transfer', 'Apple Pay', 'Cash']
type ExpenseFormProps = { initialExpense?: Expense; onSubmit: (expense: ExpenseInput) => void | Promise<void>; onCancel?: () => void }

export function ExpenseForm({ initialExpense, onSubmit, onCancel }: ExpenseFormProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<ExpenseInput>(initialExpense ? { ...initialExpense } : { amount: 0, categoryId: '', category: '' as ExpenseCategory, date: new Date().toISOString().slice(0, 10), description: '', paymentMethod: paymentMethods[0] })
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const update = <K extends keyof ExpenseInput>(key: K, value: ExpenseInput[K]) => setForm((current) => ({ ...current, [key]: value }))

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
    if (form.description.length > 120) return setError('Description must be 120 characters or fewer.')
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

  return <><form className="max-w-2xl space-y-6 rounded-2xl border border-white/8 bg-[#151818] p-5 shadow-[0_24px_80px_rgb(0_0_0/0.2)] sm:p-7" onSubmit={handleSubmit}>
    {error && <p className="rounded-xl border border-[#ff9b70]/30 bg-[#ff9b70]/10 px-4 py-3 text-sm text-[#ffb18f]" role="alert">{error}</p>}
    <div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Amount <span className="text-[#64736b]">INR</span><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d5f477]">₹</span><input className="field-input pl-8 text-xl font-semibold" min="0.01" onChange={(event) => update('amount', Number(event.target.value))} placeholder="0.00" required step="0.01" type="number" value={form.amount || ''} /></div></label><div className="field-label"><span>Category</span><div className="flex gap-2"><select className="field-input min-w-0 flex-1" disabled={categoriesLoading} onChange={(event) => selectCategory(event.target.value)} required value={form.categoryId}><option disabled value="">{categoriesLoading ? 'Loading categories...' : 'Select category'}</option>{categories.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select><button aria-label="Create new category" className="shrink-0 rounded-xl border border-[#d5f477]/30 px-3 text-[#d5f477] hover:bg-[#d5f477]/10" onClick={() => { setCategoryError(''); setCategoryModalOpen(true) }} type="button">+</button></div></div></div>
    <label className="field-label">Description <span className="text-[#64736b]">{form.description.length}/120</span><input className="field-input" maxLength={120} onChange={(event) => update('description', event.target.value)} placeholder="What did you spend on?" type="text" value={form.description} /></label>
    <div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Date<input className="field-input" onChange={(event) => update('date', event.target.value)} required type="date" value={form.date} /></label><label className="field-label">Payment method<select className="field-input" onChange={(event) => update('paymentMethod', event.target.value)} value={form.paymentMethod}>{paymentMethods.map((method) => <option key={method}>{method}</option>)}</select></label></div>
    <div className="flex flex-wrap gap-3"><button className="inline-flex items-center justify-center rounded-xl bg-[#d5f477] px-5 py-3 text-sm font-bold text-[#16210f] transition hover:-translate-y-0.5 hover:bg-[#e3ff93] disabled:cursor-wait disabled:opacity-60" disabled={submitting} type="submit">{submitting ? 'Saving...' : initialExpense ? 'Update expense' : 'Save expense'}</button>{onCancel && <button className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-[#aeb7b1] hover:border-white/20 hover:text-white" onClick={onCancel} type="button">Cancel</button>}</div>
  </form>{categoryModalOpen && <div aria-labelledby="create-category-title" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5 backdrop-blur-sm" role="dialog"><div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#141a18] p-6 shadow-[0_24px_80px_rgb(0_0_0/0.45)]"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#62d4c9]">Expense setup</p><h2 className="text-xl font-semibold" id="create-category-title">Create new category</h2></div><button aria-label="Close" className="text-xl text-[#84908a] hover:text-white" onClick={() => setCategoryModalOpen(false)} type="button">×</button></div>{categoryError && <p className="mb-4 rounded-xl border border-[#ff9b70]/30 bg-[#ff9b70]/10 px-3 py-2 text-sm text-[#ffb18f]" role="alert">{categoryError}</p>}<form className="space-y-5" onSubmit={submitCategory}><label className="field-label">Category name<input autoFocus className="field-input" maxLength={50} onChange={(event) => setNewCategoryName(event.target.value)} required type="text" value={newCategoryName} /></label><div className="flex justify-end gap-3"><button className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-[#aeb7b1] hover:border-white/20 hover:text-white" onClick={() => setCategoryModalOpen(false)} type="button">Cancel</button><button className="rounded-xl bg-[#d5f477] px-4 py-2.5 text-sm font-bold text-[#16210f] hover:bg-[#e3ff93] disabled:opacity-60" disabled={creatingCategory} type="submit">{creatingCategory ? 'Creating...' : 'Create category'}</button></div></form></div></div>}</>
}
