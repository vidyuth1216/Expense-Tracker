import { expenseBreakdown, monthlySpending } from '../data/mockData'
import { ChartPlaceholder } from '../components/ChartPlaceholder'
import { ExpenseTable } from '../components/ExpenseTable'
import { MonthPicker, PageHeader, UserProfile } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { formatINR, type Expense, type Income } from '../types/finance'

type DashboardProps = { expenses: Expense[]; incomes: Income[] }

export function Dashboard({ expenses: currentExpenses, incomes }: DashboardProps) {
  const totalIncome = incomes.reduce((total, income) => total + income.amount, 0)
  const totalExpenses = currentExpenses.reduce((total, expense) => total + expense.amount, 0)
  const remainingBalance = totalIncome - totalExpenses
  const savingsRate = totalIncome === 0 ? 0 : (remainingBalance / totalIncome) * 100

  return <>
    <PageHeader eyebrow="Tuesday, September 19, 2024" title="Good morning, Jordan" description="Here is your financial overview for this month." action={<div className="flex items-center gap-4"><MonthPicker /><UserProfile /></div>} />
    <div className="mb-5 flex justify-end"><a className="inline-flex items-center rounded-xl bg-[#c9f36a] px-4 py-2.5 text-sm font-bold text-[#16210f] hover:bg-[#dcff8b]" href="/expenses/new">+ Add expense</a></div>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total income" value={formatINR(totalIncome)} change={`${incomes.length} entries`} accent />
      <StatCard label="Total expenses" value={formatINR(totalExpenses)} change={`${currentExpenses.length} entries`} positive={false} />
      <StatCard label="Remaining balance" value={formatINR(remainingBalance)} change={remainingBalance >= 0 ? 'Available' : 'Over budget'} positive={remainingBalance >= 0} />
      <StatCard label="Savings rate" value={`${savingsRate.toFixed(1)}%`} change={totalIncome === 0 ? 'No income yet' : 'Current rate'} positive={savingsRate >= 0} />
    </section>
    <section className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <article className="rounded-2xl border border-white/8 bg-[#151818] p-5 sm:p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="font-semibold">Expense breakdown</h2><p className="mt-1 text-xs text-[#78837d]">Where your money went</p></div><button className="text-xs text-[#89938d] hover:text-white" type="button">This month <span className="ml-1">⌄</span></button></div><div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center"><ChartPlaceholder data={expenseBreakdown} total={totalExpenses} type="donut" /><div className="grid grid-cols-2 gap-x-5 gap-y-3">{expenseBreakdown.map((item) => <div className="flex items-center gap-2 text-xs text-[#a7b0aa]" key={item.label}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.label}<strong className="ml-1 text-[#e5e9e4]">{item.value}%</strong></div>)}</div></div></article>
      <article className="rounded-2xl border border-white/8 bg-[#151818] p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold">Monthly spending</h2><p className="mt-1 text-xs text-[#78837d]">Your spending over time</p></div><span className="text-xs text-[#78837d]">Last 6 months</span></div><ChartPlaceholder data={monthlySpending} type="bars" /></article>
    </section>
    <section className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-[#151818]"><div className="flex items-center justify-between px-5 py-5"><div><h2 className="font-semibold">Recent expenses</h2><p className="mt-1 text-xs text-[#78837d]">Your latest transactions</p></div><a className="text-xs font-medium text-[#c9f36a] hover:text-[#e3ffa0]" href="/expenses">View all</a></div><ExpenseTable compact expenses={currentExpenses.slice(0, 5)} /></section>
  </>
}
