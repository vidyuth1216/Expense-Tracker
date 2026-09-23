import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Income, IncomeInput } from '../types/finance'

const sources = ['Salary', 'Freelance', 'Business', 'Other']
type IncomeFormProps = { initialIncome?: Income; onSubmit: (income: IncomeInput) => void | Promise<void>; onCancel?: () => void }

export function IncomeForm({ initialIncome, onSubmit, onCancel }: IncomeFormProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<IncomeInput>(initialIncome ? { ...initialIncome } : { amount: 0, source: '', date: new Date().toISOString().slice(0, 10), description: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const update = <K extends keyof IncomeInput>(key: K, value: IncomeInput[K]) => setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.amount <= 0) return setError('Amount must be greater than ₹0.')
    if (!form.source) return setError('Choose an income source before saving.')
    if (!form.date) return setError('Choose a date before saving.')
    setError('')
    setSubmitting(true)
    try {
      await onSubmit(form)
      if (!initialIncome) navigate('/income')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save income.')
    } finally {
      setSubmitting(false)
    }
  }

  return <form className="max-w-2xl space-y-6 rounded-2xl border border-white/8 bg-[#151818] p-5 shadow-[0_24px_80px_rgb(0_0_0/0.2)] sm:p-7" onSubmit={handleSubmit}>
    {error && <p className="rounded-xl border border-[#ff9b70]/30 bg-[#ff9b70]/10 px-4 py-3 text-sm text-[#ffb18f]" role="alert">{error}</p>}
    <div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Amount <span className="text-[#64736b]">INR</span><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d5f477]">₹</span><input className="field-input pl-8 text-xl font-semibold" min="0.01" onChange={(event) => update('amount', Number(event.target.value))} placeholder="0.00" required step="0.01" type="number" value={form.amount || ''} /></div></label><label className="field-label">Source<select className="field-input" onChange={(event) => update('source', event.target.value)} required value={form.source}><option disabled value="">Select source</option>{sources.map((source) => <option key={source}>{source}</option>)}</select></label></div>
    <label className="field-label">Description <span className="text-[#64736b]">Optional</span><input className="field-input" maxLength={120} onChange={(event) => update('description', event.target.value)} placeholder="What was this income for?" type="text" value={form.description} /></label>
    <label className="field-label">Date<input className="field-input" onChange={(event) => update('date', event.target.value)} required type="date" value={form.date} /></label>
    <div className="flex flex-wrap gap-3"><button className="inline-flex items-center justify-center rounded-xl bg-[#d5f477] px-5 py-3 text-sm font-bold text-[#16210f] transition hover:-translate-y-0.5 hover:bg-[#e3ff93] disabled:cursor-wait disabled:opacity-60" disabled={submitting} type="submit">{submitting ? 'Saving...' : initialIncome ? 'Update income' : 'Save income'}</button>{onCancel && <button className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-[#aeb7b1] hover:border-white/20 hover:text-white" onClick={onCancel} type="button">Cancel</button>}</div>
  </form>
}