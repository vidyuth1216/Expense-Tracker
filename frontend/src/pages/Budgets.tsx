import { useEffect, useMemo, useState } from 'react'
import { BudgetForm } from '../components/BudgetForm'
import { EmptyState, ErrorState, TableSkeleton } from '../components/AsyncState'
import { Icon } from '../components/Icon'
import { PageHeader } from '../components/PageHeader'
import { createBudget, deleteBudget, getBudgets, updateBudget } from '../services/budgetService'
import { getApiErrorMessage } from '../services/api'
import { formatINR, type Budget, type BudgetInput } from '../types/finance'

const currentMonth = new Date().toISOString().slice(0, 7)
const monthLabel = (month: string) => new Date(`${month}-02`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

export function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [month, setMonth] = useState(currentMonth)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Budget>()

  const load = async () => { setLoading(true); setError(''); try { setBudgets(await getBudgets()) } catch (requestError) { setError(getApiErrorMessage(requestError)) } finally { setLoading(false) } }
  useEffect(() => { void load() }, [])
  const visibleBudgets = useMemo(() => budgets.filter((budget) => budget.month === month), [budgets, month])
  const knownMonths = [...new Set(budgets.map((budget) => budget.month))].sort().reverse()

  const save = async (input: BudgetInput) => { if (editing) await updateBudget(editing.id, input); else await createBudget(input); setShowForm(false); setEditing(undefined); await load() }
  const remove = async (budget: Budget) => { if (!window.confirm(`Delete the ${budget.category} budget for ${monthLabel(budget.month)}?`)) return; try { await deleteBudget(budget.id); await load() } catch (requestError) { setError(getApiErrorMessage(requestError)) } }

  return <>
    <PageHeader eyebrow="Planning / guardrails" title="Budgets" description="Set monthly limits and keep spending visible." action={<button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d5f477] px-4 py-3 text-sm font-bold text-[#16210f] hover:bg-[#e3ff93]" onClick={() => { setEditing(undefined); setShowForm(true) }} type="button"><Icon name="plus" size={17} />Add budget</button>} />
    {showForm && <section className="mb-6"><BudgetForm initialBudget={editing} onCancel={() => { setShowForm(false); setEditing(undefined) }} onSubmit={save} /></section>}
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-white">{monthLabel(month)}</p><p className="mt-1 text-xs text-[#78837d]">{visibleBudgets.length} category {visibleBudgets.length === 1 ? 'limit' : 'limits'}</p></div><select className="field-input w-auto min-w-44" onChange={(event) => setMonth(event.target.value)} value={month}><option value={currentMonth}>{monthLabel(currentMonth)}</option>{knownMonths.filter((item) => item !== currentMonth).map((item) => <option key={item} value={item}>{monthLabel(item)}</option>)}</select></div>
    {loading ? <section className="overflow-hidden rounded-2xl border border-white/8 bg-[#151818]"><TableSkeleton columns={4} /></section> : error ? <ErrorState title="Unable to load budgets. Try again." description={error} action={{ label: 'Try again', onClick: load }} /> : !visibleBudgets.length ? <EmptyState title={`No budgets for ${monthLabel(month)}`} description="Create a category limit to start tracking your monthly spending." action={() => setShowForm(true)} /> : <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleBudgets.map((budget) => <BudgetCard budget={budget} key={budget.id} onDelete={remove} onEdit={(item) => { setEditing(item); setShowForm(true) }} />)}</section>}
  </>
}

function BudgetCard({ budget, onEdit, onDelete }: { budget: Budget; onEdit: (budget: Budget) => void; onDelete: (budget: Budget) => void }) {
  const progress = Math.min(budget.progressPercentage, 100)
  return <article className={`rounded-2xl border p-5 ${budget.isOverBudget ? 'border-[#ff9b70]/40 bg-[#291d1a]' : 'border-white/8 bg-[#151818]'}`}><div className="flex items-start justify-between gap-3"><div><p className="text-lg font-semibold text-white">{budget.category}</p><p className="mt-1 text-xs text-[#78837d]">{monthLabel(budget.month)}</p></div><div className="flex gap-1"><button aria-label={`Edit ${budget.category} budget`} className="rounded-lg p-2 text-[#8d9891] hover:bg-white/5 hover:text-white" onClick={() => onEdit(budget)} type="button"><Icon name="edit" size={16} /></button><button aria-label={`Delete ${budget.category} budget`} className="rounded-lg p-2 text-[#8d9891] hover:bg-[#ff9b70]/10 hover:text-[#ff9b70]" onClick={() => onDelete(budget)} type="button"><Icon name="trash" size={16} /></button></div></div><div className="mt-6 flex items-end justify-between gap-3"><div><p className="text-2xl font-semibold text-white">{formatINR(budget.spent)}</p><p className="mt-1 text-xs text-[#78837d]">spent of {formatINR(budget.amount)}</p></div><p className={`text-sm font-bold ${budget.isOverBudget ? 'text-[#ff9b70]' : 'text-[#d5f477]'}`}>{budget.progressPercentage.toFixed(0)}%</p></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${budget.isOverBudget ? 'bg-[#ff9b70]' : 'bg-[#d5f477]'}`} style={{ width: `${progress}%` }} /></div><p className={`mt-3 text-sm ${budget.isOverBudget ? 'font-semibold text-[#ffb18f]' : 'text-[#aeb7b1]'}`}>{budget.isOverBudget ? `${formatINR(Math.abs(budget.remaining))} over budget` : `${formatINR(budget.remaining)} remaining`}</p></article>
}