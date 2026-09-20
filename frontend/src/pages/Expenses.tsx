import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExpenseTable } from '../components/ExpenseTable'
import { Icon } from '../components/Icon'
import { PageHeader } from '../components/PageHeader'
import type { Expense, ExpenseCategory, ExpenseInput } from '../types/finance'

const categories: ExpenseCategory[] = ['Housing', 'Food', 'Transport', 'Shopping', 'Health', 'Entertainment']

export function Expenses({ expenses, onUpdate, onDelete }: { expenses: Expense[]; onUpdate: (id: string, expense: ExpenseInput) => void; onDelete: (id: string) => void }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [month, setMonth] = useState('All months')
  const filteredExpenses = useMemo(() => expenses.filter((expense) => expense.description.toLowerCase().includes(search.toLowerCase()) && (category === 'All categories' || expense.category === category) && (month === 'All months' || expense.date.startsWith(month))).sort((a, b) => b.date.localeCompare(a.date)), [expenses, search, category, month])
  const months = [...new Set(expenses.map((expense) => expense.date.slice(0, 7)))].sort().reverse()
  return <><PageHeader eyebrow="Transactions / ledger" title="Expenses" description={`${expenses.length} entries, sorted newest first.`} action={<Link className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d5f477] px-4 py-3 text-sm font-bold text-[#16210f] hover:bg-[#e3ff93]" to="/expenses/new"><Icon name="plus" size={17} />Add expense</Link>} /><section className="overflow-hidden rounded-2xl border border-white/8 bg-[#151818]"><div className="grid gap-3 border-b border-white/8 p-4 sm:grid-cols-[1fr_auto_auto]"><label className="relative"><Icon name="search" size={17} /><input className="h-10 w-full rounded-xl border border-white/10 bg-[#101212] pl-10 pr-3 text-sm text-white outline-none placeholder:text-[#66716b] focus:border-[#d5f477]/60" onChange={(event) => setSearch(event.target.value)} placeholder="Search descriptions..." type="search" value={search} /></label><select className="h-10 rounded-xl border border-white/10 bg-[#101212] px-3 text-sm text-[#aeb7b1] outline-none focus:border-[#d5f477]/60" onChange={(event) => setCategory(event.target.value)} value={category}><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><select className="h-10 rounded-xl border border-white/10 bg-[#101212] px-3 text-sm text-[#aeb7b1] outline-none focus:border-[#d5f477]/60" onChange={(event) => setMonth(event.target.value)} value={month}><option>All months</option>{months.map((item) => <option key={item} value={item}>{new Date(`${item}-02`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</option>)}</select></div><ExpenseTable expenses={filteredExpenses} onDelete={onDelete} onUpdate={onUpdate} /></section></>
}
