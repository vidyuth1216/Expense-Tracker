import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { IncomeForm } from '../components/IncomeForm'
import { IncomeTable } from '../components/IncomeTable'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import type { Income as IncomeRecord, IncomeInput } from '../types/finance'

export function Income({ incomes, onCreate, onUpdate, onDelete }: { incomes: IncomeRecord[]; onCreate: (income: IncomeInput) => void; onUpdate: (id: string, income: IncomeInput) => void; onDelete: (id: string) => void }) {
  const [showForm, setShowForm] = useState(false)
  const totalIncome = incomes.reduce((total, income) => total + income.amount, 0)
  return <><PageHeader eyebrow="Transactions / inflow" title="Income" description={`${incomes.length} income entries, sorted newest first.`} action={<button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d5f477] px-4 py-3 text-sm font-bold text-[#16210f] hover:bg-[#e3ff93]" onClick={() => setShowForm((current) => !current)} type="button"><Icon name="plus" size={17} />{showForm ? 'Close form' : 'Add income'}</button>} />{showForm && <section className="mb-5"><IncomeForm onCancel={() => setShowForm(false)} onSubmit={(income) => { onCreate(income); setShowForm(false) }} /></section>}<section className="mb-5 grid gap-4 sm:grid-cols-2"><StatCard label="Tracked income" value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(totalIncome)} change={`${incomes.length} entries`} accent /><StatCard label="Income sources" value={`${new Set(incomes.map((income) => income.source)).size} active`} change="Frontend only" /></section><section className="overflow-hidden rounded-2xl border border-white/8 bg-[#151818]"><div className="px-5 py-5"><h2 className="font-semibold">Income history</h2><p className="mt-1 text-xs text-[#78837d]">Your latest inflows</p></div><IncomeTable incomes={incomes} onDelete={onDelete} onUpdate={onUpdate} /></section><p className="mt-6 text-sm text-[#78837d]">Income is stored in frontend state for now. <Link className="text-[#c9f36a]" to="/">Return to overview</Link></p></>
}
