import { useState } from 'react'
import { Icon } from '../components/Icon'
import { IncomeForm } from '../components/IncomeForm'
import { IncomeTable } from '../components/IncomeTable'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import type { Income as IncomeRecord, IncomeInput } from '../types/finance'
import { EmptyState, ErrorState, TableSkeleton } from '../components/AsyncState'

export function Income({ incomes, loading, loadError, onRetry, onCreate, onUpdate, onDelete }: { incomes: IncomeRecord[]; loading: boolean; loadError?: string; onRetry?: () => void; onCreate: (income: IncomeInput) => Promise<void>; onUpdate: (id: string, income: IncomeInput) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [showForm, setShowForm] = useState(false)
  const totalIncome = incomes.reduce((total, income) => total + income.amount, 0)
  if (loading) return <><PageHeader eyebrow="Transactions / inflow" title="Income" description="Loading your income..." /><section className="overflow-hidden rounded-2xl border border-white/8 bg-[#151818]"><TableSkeleton columns={5} /></section></>
  if (loadError) return <><PageHeader eyebrow="Transactions / inflow" title="Income" description="Your income history." /><ErrorState title="Unable to load income. Try again." description={loadError} action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined} /></>
  return <><PageHeader eyebrow="Transactions / inflow" title="Income" description={`${incomes.length} income entries, sorted newest first.`} action={<button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d5f477] px-4 py-3 text-sm font-bold text-[#16210f] hover:bg-[#e3ff93]" onClick={() => setShowForm((current) => !current)} type="button"><Icon name="plus" size={17} />{showForm ? 'Close form' : 'Add income'}</button>} />{showForm && <section className="mb-5"><IncomeForm onCancel={() => setShowForm(false)} onSubmit={async (income) => { await onCreate(income); setShowForm(false) }} /></section>}<section className="mb-5 grid gap-4 sm:grid-cols-2"><StatCard label="Tracked income" value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(totalIncome)} change={`${incomes.length} entries`} accent /><StatCard label="Income sources" value={`${new Set(incomes.map((income) => income.source)).size} active`} change="From your income records" /></section>{incomes.length ? <section className="overflow-hidden rounded-2xl border border-white/8 bg-[#151818]"><div className="px-5 py-5"><h2 className="font-semibold">Income history</h2><p className="mt-1 text-xs text-[#78837d]">Your latest inflows</p></div><IncomeTable incomes={incomes} onDelete={onDelete} onUpdate={onUpdate} /></section> : <EmptyState title="No income yet" description="Add your first income entry to start tracking your balance." action={() => setShowForm(true)} />}</>
}
