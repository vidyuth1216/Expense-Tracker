import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Expense, ExpenseCategory, ExpenseInput } from '../types/finance'

const categories: ExpenseCategory[] = ['Housing', 'Food', 'Transport', 'Shopping', 'Health', 'Entertainment']
const paymentMethods = ['Visa •••• 4242', 'Bank transfer', 'Apple Pay', 'Cash']
type ExpenseFormProps = { initialExpense?: Expense; onSubmit: (expense: ExpenseInput) => void; onCancel?: () => void }

export function ExpenseForm({ initialExpense, onSubmit, onCancel }: ExpenseFormProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<ExpenseInput>(initialExpense ? { ...initialExpense } : { amount: 0, category: '' as ExpenseCategory, date: new Date().toISOString().slice(0, 10), description: '', paymentMethod: paymentMethods[0] })
  const [error, setError] = useState('')
  const update = <K extends keyof ExpenseInput>(key: K, value: ExpenseInput[K]) => setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.amount <= 0) return setError('Amount must be greater than ₹0.')
    if (!form.category) return setError('Choose a category before saving.')
    if (!form.date) return setError('Choose a date before saving.')
    if (form.description.length > 120) return setError('Description must be 120 characters or fewer.')
    setError('')
    onSubmit(form)
    if (!initialExpense) navigate('/expenses')
  }

  return <form className="max-w-2xl space-y-6 rounded-2xl border border-white/8 bg-[#151818] p-5 shadow-[0_24px_80px_rgb(0_0_0/0.2)] sm:p-7" onSubmit={handleSubmit}>
    {error && <p className="rounded-xl border border-[#ff9b70]/30 bg-[#ff9b70]/10 px-4 py-3 text-sm text-[#ffb18f]" role="alert">{error}</p>}
    <div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Amount <span className="text-[#64736b]">INR</span><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d5f477]">₹</span><input className="field-input pl-8 text-xl font-semibold" min="0.01" onChange={(event) => update('amount', Number(event.target.value))} placeholder="0.00" required step="0.01" type="number" value={form.amount || ''} /></div></label><label className="field-label">Category<select className="field-input" onChange={(event) => update('category', event.target.value as ExpenseCategory)} required value={form.category}><option disabled value="">Select category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label></div>
    <label className="field-label">Description <span className="text-[#64736b]">{form.description.length}/120</span><input className="field-input" maxLength={120} onChange={(event) => update('description', event.target.value)} placeholder="What did you spend on?" type="text" value={form.description} /></label>
    <div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Date<input className="field-input" onChange={(event) => update('date', event.target.value)} required type="date" value={form.date} /></label><label className="field-label">Payment method<select className="field-input" onChange={(event) => update('paymentMethod', event.target.value)} value={form.paymentMethod}>{paymentMethods.map((method) => <option key={method}>{method}</option>)}</select></label></div>
    <div className="flex flex-wrap gap-3"><button className="inline-flex items-center justify-center rounded-xl bg-[#d5f477] px-5 py-3 text-sm font-bold text-[#16210f] transition hover:-translate-y-0.5 hover:bg-[#e3ff93]" type="submit">{initialExpense ? 'Update expense' : 'Save expense'}</button>{onCancel && <button className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-[#aeb7b1] hover:border-white/20 hover:text-white" onClick={onCancel} type="button">Cancel</button>}</div>
  </form>
}
