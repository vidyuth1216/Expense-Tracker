import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExpenseTable } from '../components/ExpenseTable'
import { Icon } from '../components/Icon'
import { PageHeader } from '../components/PageHeader'
import type { Expense, ExpenseInput, CategoryOption } from '../types/finance'
import { EmptyState, ErrorState, TableSkeleton } from '../components/AsyncState'
import { deleteCategory, getCategories } from '../services/categoryService'
import { getApiErrorMessage } from '../services/api'

export function Expenses({ expenses, loading, loadError, onRetry, onUpdate, onDelete }: { expenses: Expense[]; loading: boolean; loadError?: string; onRetry?: () => void; onUpdate: (id: string, expense: ExpenseInput) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [month, setMonth] = useState('All months')
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [categoryError, setCategoryError] = useState('')
  const [deletingCategoryId, setDeletingCategoryId] = useState('')
  useEffect(() => { getCategories().then(setCategories).catch((requestError) => setCategoryError(getApiErrorMessage(requestError))) }, [])
  const filteredExpenses = useMemo(() => expenses.filter((expense) => (expense.description ?? '').toLowerCase().includes(search.toLowerCase()) && (category === 'All categories' || expense.category === category) && (month === 'All months' || expense.date.startsWith(month))).sort((a, b) => b.date.localeCompare(a.date)), [expenses, search, category, month])
  const months = [...new Set(expenses.map((expense) => expense.date.slice(0, 7)))].sort().reverse()
  const removeCategory = async (categoryOption: CategoryOption) => {
    if (!window.confirm(`Delete the ${categoryOption.name} category? Existing expenses will be moved to Other.`)) return
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
  if (loading) return <><PageHeader eyebrow="Transactions / ledger" title="Expenses" description="Loading your expenses..." /><section className="overflow-hidden rounded-2xl border border-white/8 bg-[#151818]"><TableSkeleton columns={6} /></section></>
  if (loadError) return <><PageHeader eyebrow="Transactions / ledger" title="Expenses" description="Your expense history." /><ErrorState title="Unable to load expenses. Try again." description={loadError} action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined} /></>
  return <><PageHeader eyebrow="Transactions / ledger" title="Expenses" description={`${expenses.length} entries, sorted newest first.`} action={<div className="flex flex-wrap gap-3"><button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-[#aeb7b1] hover:border-white/20 hover:text-white" onClick={() => { setCategoryError(''); setCategoryModalOpen(true) }} type="button">Manage categories</button><Link className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d5f477] px-4 py-3 text-sm font-bold text-[#16210f] hover:bg-[#e3ff93]" to="/expenses/new"><Icon name="plus" size={17} />Add expense</Link></div>} />{!expenses.length ? <EmptyState title="No expenses yet" description="Add your first expense to start tracking your spending." action={() => window.location.assign('/expenses/new')} /> : <section className="overflow-hidden rounded-2xl border border-white/8 bg-[#151818]"><div className="grid gap-3 border-b border-white/8 p-4 sm:grid-cols-[1fr_auto_auto]"><label className="relative"><Icon name="search" size={17} /><input className="h-10 w-full rounded-xl border border-white/10 bg-[#101212] pl-10 pr-3 text-sm text-white outline-none placeholder:text-[#66716b] focus:border-[#d5f477]/60" onChange={(event) => setSearch(event.target.value)} placeholder="Search descriptions..." type="search" value={search} /></label><select className="h-10 rounded-xl border border-white/10 bg-[#101212] px-3 text-sm text-[#aeb7b1] outline-none focus:border-[#d5f477]/60" onChange={(event) => setCategory(event.target.value)} value={category}><option>All categories</option>{categories.map((item) => <option key={item.id}>{item.name}</option>)}</select><select className="h-10 rounded-xl border border-white/10 bg-[#101212] px-3 text-sm text-[#aeb7b1] outline-none focus:border-[#d5f477]/60" onChange={(event) => setMonth(event.target.value)} value={month}><option>All months</option>{months.map((item) => <option key={item} value={item}>{new Date(`${item}-02`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</option>)}</select></div><ExpenseTable emptyTitle="No matching expenses" expenses={filteredExpenses} onDelete={onDelete} onUpdate={onUpdate} /></section>}{categoryModalOpen && <div aria-labelledby="manage-categories-title" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5 backdrop-blur-sm" role="dialog"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141a18] p-6 shadow-[0_24px_80px_rgb(0_0_0/0.45)]"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#62d4c9]">Expense setup</p><h2 className="text-xl font-semibold" id="manage-categories-title">Manage categories</h2></div><button aria-label="Close" className="text-xl text-[#84908a] hover:text-white" onClick={() => setCategoryModalOpen(false)} type="button">×</button></div>{categoryError && <p className="mb-4 rounded-xl border border-[#ff9b70]/30 bg-[#ff9b70]/10 px-3 py-2 text-sm text-[#ffb18f]" role="alert">{categoryError}</p>}<div className="space-y-2">{categories.map((item) => <div className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-[#101513] px-4 py-3" key={item.id}><span className="text-sm text-white">{item.name}</span><button aria-label={`Delete ${item.name} category`} className="rounded-lg p-2 text-[#8d9891] hover:bg-[#ff9b70]/10 hover:text-[#ff9b70] disabled:cursor-wait disabled:opacity-50" disabled={deletingCategoryId === item.id} onClick={() => void removeCategory(item)} type="button"><Icon name="trash" size={16} /></button></div>)}{!categories.length && <p className="py-4 text-sm text-[#78837d]">No categories available.</p>}</div><button className="mt-5 w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-[#aeb7b1] hover:border-white/20 hover:text-white" onClick={() => setCategoryModalOpen(false)} type="button">Close</button></div></div>}</>
}
