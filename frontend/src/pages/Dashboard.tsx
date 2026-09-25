import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChartPlaceholder } from '../components/ChartPlaceholder'
import { ExpenseTable } from '../components/ExpenseTable'
import { DashboardSkeleton, EmptyState, ErrorState } from '../components/AsyncState'
import { PageHeader, UserProfile } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { getApiErrorMessage } from '../services/api'
import { getDashboardData } from '../services/dashboardService'
import { formatINR, type DashboardData } from '../types/finance'
import { useAuth } from '../context/AuthContext'

const chartColors = ['#c9f36a', '#4ecdc4', '#ffb86b', '#ff7a90', '#9693c9', '#83ddd5']
const currentMonth = new Date().toISOString().slice(0, 7)

function monthLabel(month: string, options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }): string {
  return new Date(`${month}-02`).toLocaleDateString('en-IN', options)
}

export function Dashboard({ refreshToken = 0 }: { refreshToken?: number }) {
  const { user } = useAuth()
  const [month, setMonth] = useState(currentMonth)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError('')
    getDashboardData(month)
      .then((dashboard) => { if (active) setData(dashboard) })
      .catch((requestError) => { if (active) setLoadError(getApiErrorMessage(requestError)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [month, refreshToken, retryToken])

  const breakdown = useMemo(() => data?.expenseBreakdown.map((item, index) => ({ label: item.category, value: item.percentage, color: chartColors[index % chartColors.length] })) ?? [], [data])
  const history = useMemo(() => data?.sixMonthHistory.map((item) => ({ month: monthLabel(item.month, { month: 'short' }), amount: item.amount })) ?? [], [data])
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  if (loading) return <><PageHeader eyebrow={today} title={`Good morning, ${user?.name ?? 'there'}`} description="Here is your financial overview for the selected month." action={<DashboardMonthSelect month={month} onChange={setMonth} />} /><DashboardSkeleton /></>
  if (loadError || !data) return <><PageHeader eyebrow={today} title={`Good morning, ${user?.name ?? 'there'}`} description="Here is your financial overview for the selected month." action={<DashboardMonthSelect month={month} onChange={setMonth} />} /><ErrorState title="Unable to load dashboard. Try again." description={loadError || 'No dashboard data is available.'} action={{ label: 'Try again', onClick: () => setRetryToken((token) => token + 1) }} /></>

  return <>
    <PageHeader eyebrow={today} title={`Good morning, ${user?.name ?? 'there'}`} description={`Your financial overview for ${monthLabel(data.month)}.`} action={<div className="flex items-center gap-4"><DashboardMonthSelect month={month} onChange={setMonth} /><UserProfile /></div>} />
    <div className="mb-5 flex justify-end"><Link className="inline-flex items-center rounded-xl bg-[#c9f36a] px-4 py-2.5 text-sm font-bold text-[#16210f] hover:bg-[#dcff8b]" to="/expenses/new">+ Add expense</Link></div>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total income" value={formatINR(data.totalIncome)} change={`${monthLabel(data.month, { month: 'short' })} total`} accent />
      <StatCard label="Total expenses" value={formatINR(data.totalExpenses)} change={`${data.recentExpenses.length} recent entries`} positive={false} />
      <StatCard label="Remaining balance" value={formatINR(data.remainingBalance)} change={data.remainingBalance >= 0 ? 'Available' : 'Over budget'} positive={data.remainingBalance >= 0} />
      <StatCard label="Savings rate" value={`${data.savingsRate.toFixed(1)}%`} change={data.totalIncome === 0 ? 'No income yet' : 'Current rate'} positive={data.savingsRate >= 0} />
    </section>
    <section className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <article className="rounded-2xl border border-white/8 bg-[#151818] p-5 sm:p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="font-semibold">Expense breakdown</h2><p className="mt-1 text-xs text-[#78837d]">Where your money went in {monthLabel(data.month)}</p></div></div>{breakdown.length ? <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center"><ChartPlaceholder data={breakdown} total={data.totalExpenses} type="donut" /><div className="grid grid-cols-2 gap-x-5 gap-y-3">{breakdown.map((item) => <div className="flex items-center gap-2 text-xs text-[#a7b0aa]" key={item.label}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.label}<strong className="ml-1 text-[#e5e9e4]">{item.value}%</strong></div>)}</div></div> : <EmptyState title="No expenses this month" description="Add an expense to see your category breakdown." />}</article>
      <article className="rounded-2xl border border-white/8 bg-[#151818] p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold">Monthly spending</h2><p className="mt-1 text-xs text-[#78837d]">Your spending over time</p></div><span className="text-xs text-[#78837d]">Last 6 months</span></div>{history.length ? <ChartPlaceholder data={history} type="bars" /> : <EmptyState title="No spending history" description="Expenses will appear here as you add them." />}</article>
    </section>
    <section className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-[#151818]"><div className="flex items-center justify-between px-5 py-5"><div><h2 className="font-semibold">Recent expenses</h2><p className="mt-1 text-xs text-[#78837d]">Your latest transactions for {monthLabel(data.month)}</p></div><Link className="text-xs font-medium text-[#c9f36a] hover:text-[#e3ffa0]" to="/expenses">View all</Link></div>{data.recentExpenses.length ? <ExpenseTable compact expenses={data.recentExpenses} /> : <EmptyState title="No expenses yet" description="Add your first expense to see it here." />}</section>
  </>
}

function DashboardMonthSelect({ month, onChange }: { month: string; onChange: (month: string) => void }) {
  const options = Array.from({ length: 12 }, (_, index) => {
    const date = new Date()
    date.setUTCMonth(date.getUTCMonth() - index)
    return date.toISOString().slice(0, 7)
  })
  return <select aria-label="Dashboard month" className="field-input w-auto min-w-44 border-white/10 bg-[#171a1a] text-[#dce1dd]" onChange={(event) => onChange(event.target.value)} value={month}>{options.map((option) => <option key={option} value={option}>{monthLabel(option)}</option>)}</select>
}
