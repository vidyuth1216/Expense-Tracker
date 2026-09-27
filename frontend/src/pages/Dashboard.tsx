import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChartPlaceholder } from '../components/ChartPlaceholder'
import { ExpenseTable } from '../components/ExpenseTable'
import { DashboardSkeleton, EmptyState, ErrorState } from '../components/AsyncState'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { Icon } from '../components/Icon'
import { getApiErrorMessage } from '../services/api'
import { getDashboardData } from '../services/dashboardService'
import { formatINR, type DashboardData } from '../types/finance'
import { useAuth } from '../context/AuthContext'

const chartColors = ['#5D9B76', '#9B8AFB', '#C89B58', '#C66A72', '#6F61C0', '#4B5563']
const currentMonth = new Date().toISOString().slice(0, 7)

function monthLabel(
  month: string,
  options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }
): string {
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
      .then((dashboard) => {
        if (active) setData(dashboard)
      })
      .catch((requestError) => {
        if (active) setLoadError(getApiErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [month, refreshToken, retryToken])

  const breakdown = useMemo(
    () =>
      data?.expenseBreakdown.map((item, index) => ({
        label: item.category,
        value: item.percentage,
        color: chartColors[index % chartColors.length],
      })) ?? [],
    [data]
  )

  const history = useMemo(
    () =>
      data?.sixMonthHistory.map((item) => ({
        month: monthLabel(item.month, { month: 'short' }),
        amount: item.amount,
      })) ?? [],
    [data]
  )

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const headerActions = (
    <div className="flex flex-wrap items-center gap-3">
      <DashboardMonthSelect month={month} onChange={setMonth} />
      <Link
        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-nav-active-bg)] px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
        to="/expenses/new"
      >
        <Icon name="plus" size={16} />
        <span>Add expense</span>
      </Link>
    </div>
  )

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow={today}
          title={`Good morning, ${user?.name ?? 'there'}`}
          description="Here is your financial overview for the selected month."
          action={headerActions}
        />
        <DashboardSkeleton />
      </>
    )
  }

  if (loadError || !data) {
    return (
      <>
        <PageHeader
          eyebrow={today}
          title={`Good morning, ${user?.name ?? 'there'}`}
          description="Here is your financial overview for the selected month."
          action={headerActions}
        />
        <ErrorState
          title="Unable to load dashboard. Try again."
          description={loadError || 'No dashboard data is available.'}
          action={{ label: 'Try again', onClick: () => setRetryToken((token) => token + 1) }}
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow={today}
        title={`Good morning, ${user?.name ?? 'there'}`}
        description={`Your financial overview for ${monthLabel(data.month)}.`}
        action={headerActions}
      />

      {/* 4 Summary Metric Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Income"
          value={formatINR(data.totalIncome)}
          change={`${monthLabel(data.month, { month: 'short' })} total`}
          positive={true}
        />
        <StatCard
          label="Total Expenses"
          value={formatINR(data.totalExpenses)}
          change={`${data.recentExpenses.length} recent entries`}
          positive={false}
        />
        <StatCard
          label="Remaining balance"
          value={formatINR(data.remainingBalance)}
          change={data.remainingBalance >= 0 ? 'Available' : 'Over budget'}
          positive={data.remainingBalance >= 0}
        />
        <StatCard
          label="Savings rate"
          value={`${data.savingsRate.toFixed(1)}%`}
          change={data.totalIncome === 0 ? 'No income yet' : 'Current rate'}
          positive={data.savingsRate >= 0}
        />
      </section>

      {/* Middle Section: Expense breakdown donut and Monthly spending bar chart */}
      <section className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-colors">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text)]">
                Expense breakdown
              </h2>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Where your money went in {monthLabel(data.month)}
              </p>
            </div>
          </div>
          {breakdown.length ? (
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <ChartPlaceholder data={breakdown} total={data.totalExpenses} type="donut" />
              <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                {breakdown.map((item) => (
                  <div
                    className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]"
                    key={item.label}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                    <strong className="ml-1 text-[var(--color-text)] tabular-nums">
                      {item.value}%
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No expenses this month"
              description="Add an expense to see your category breakdown."
            />
          )}
        </article>

        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-colors">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text)]">Monthly spending</h2>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">Your spending over time</p>
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">Last 6 months</span>
          </div>
          {history.length ? (
            <ChartPlaceholder data={history} type="bars" />
          ) : (
            <EmptyState
              title="No spending history"
              description="Expenses will appear here as you add them."
            />
          )}
        </article>
      </section>

      {/* Bottom Section: Recent transactions ledger (CLEAN, ISOLATED CONTAINER FIXING OVERLAP BUG) */}
      <section className="mt-5 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text)]">Recent expenses</h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              Your latest transactions for {monthLabel(data.month)}
            </p>
          </div>
          <Link
            className="text-xs font-medium text-[var(--color-accent)] hover:underline"
            to="/expenses"
          >
            View all
          </Link>
        </div>
        {data.recentExpenses.length ? (
          <ExpenseTable compact expenses={data.recentExpenses} />
        ) : (
          <EmptyState
            title="No expenses yet"
            description="Add your first expense to see it here."
          />
        )}
      </section>
    </>
  )
}

function DashboardMonthSelect({
  month,
  onChange,
}: {
  month: string
  onChange: (month: string) => void
}) {
  const options = Array.from({ length: 12 }, (_, index) => {
    const date = new Date()
    date.setUTCMonth(date.getUTCMonth() - index)
    return date.toISOString().slice(0, 7)
  })

  return (
    <select
      aria-label="Dashboard month"
      className="h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-accent)] cursor-pointer"
      onChange={(event) => onChange(event.target.value)}
      value={month}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {monthLabel(option)}
        </option>
      ))}
    </select>
  )
}
