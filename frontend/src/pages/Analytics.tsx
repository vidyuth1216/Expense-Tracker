import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardSkeleton, EmptyState, ErrorState } from '../components/AsyncState'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { getApiErrorMessage } from '../services/api'
import { getAnalytics } from '../services/analyticsService'
import { formatINR, type AnalyticsData } from '../types/finance'
import { useTheme } from '../context/ThemeContext'

const formatMonth = (month: string) =>
  new Date(`${month}-02`).toLocaleDateString('en-IN', { month: 'short' })

export function Analytics() {
  const { colors } = useTheme()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError('')
    getAnalytics()
      .then((analytics) => {
        if (active) setData(analytics)
      })
      .catch((error) => {
        if (active) setLoadError(getApiErrorMessage(error))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [retryToken])

  const categoryColors = [
    colors.positive,
    colors.accent,
    colors.warning,
    colors.negative,
    colors.accentHover,
    colors.chartNeutral,
  ]

  const tooltipStyle = {
    backgroundColor: colors.surfaceElevated,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    color: colors.text,
    fontSize: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  }

  const axisTick = { fill: colors.textMuted, fontSize: 11 }

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow="Reports & analytics"
          title="Reports & analytics"
          description="A clearer view of your income, spending, and savings."
        />
        <DashboardSkeleton label="Loading analytics" />
      </>
    )
  }

  if (loadError || !data) {
    return (
      <>
        <PageHeader
          eyebrow="Reports & analytics"
          title="Reports & analytics"
          description="A clearer view of your income, spending, and savings."
        />
        <ErrorState
          title="Unable to load analytics. Try again."
          description={loadError || 'No analytics data is available.'}
          action={{ label: 'Try again', onClick: () => setRetryToken((token) => token + 1) }}
        />
      </>
    )
  }

  const trendDescription = data.monthlyTotals
    .map(
      (item) =>
        `${formatMonth(item.month)}: income ${formatINR(item.income)}, expenses ${formatINR(
          item.expenses
        )}, savings ${formatINR(item.savings)}`
    )
    .join('. ')

  const categoryDescription = data.categoryBreakdown
    .map((item) => `${item.category}: ${formatINR(item.amount)}, ${item.percentage}%`)
    .join('. ')

  return (
    <>
      <PageHeader
        eyebrow="Last 8 months"
        title="Reports & analytics"
        description="A clearer view of your income, spending, and savings."
      />

      {/* 4 Summary Metric Cards */}
      <section aria-label="Spending summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Average monthly spending"
          value={formatINR(data.averageMonthlySpending)}
          change="Across the last 6 months"
          positive={false}
        />
        <StatCard
          label="Average daily spending"
          value={formatINR(data.averageDailySpending)}
          change="Through today"
          positive={false}
        />
        <StatCard
          label="Highest spending category"
          value={data.highestSpendingCategory?.category ?? '—'}
          change={
            data.highestSpendingCategory
              ? formatINR(data.highestSpendingCategory.amount)
              : 'No spending yet'
          }
          positive={false}
        />
        <StatCard
          label="Total spent"
          value={formatINR(data.totalSpending)}
          change="Across the last 6 months"
          positive={false}
        />
      </section>

      {/* Grid: Income vs expenses and Spending by category */}
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-colors">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              Income vs expenses
            </h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              Monthly cash flow and savings
            </p>
          </div>
          <div
            aria-describedby="monthly-flow-summary"
            aria-label={`Monthly income, expenses, and savings. ${trendDescription}`}
            className="h-72 w-full"
            role="img"
          >
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                data={data.monthlyTotals}
                margin={{ top: 8, right: 8, left: 2, bottom: 0 }}
              >
                <CartesianGrid stroke={colors.border} strokeOpacity={0.6} vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="month"
                  tick={axisTick}
                  tickFormatter={formatMonth}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={axisTick}
                  tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                  tickLine={false}
                  width={68}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: '#282536' }}
                  formatter={(value, name) => [
                    formatINR(Number(value)),
                    String(name).charAt(0).toUpperCase() + String(name).slice(1),
                  ]}
                  labelFormatter={(label) =>
                    new Date(`${label}-02`).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric',
                    })
                  }
                />
                <Bar dataKey="income" fill={colors.positive} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill={colors.negative} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="sr-only" id="monthly-flow-summary">
            {trendDescription || 'No income or expense data for this period.'}
          </p>
          <div className="mt-4 flex justify-center gap-6 text-xs text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.positive }}
              />
              Income
            </span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.negative }}
              />
              Expenses
            </span>
          </div>
        </article>

        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-colors">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              Spending by category
            </h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              Share of total spent across six months
            </p>
          </div>
          {data.categoryBreakdown.length ? (
            <>
              <div
                aria-label={`Spending by category. ${categoryDescription}`}
                className="h-56 w-full"
                role="img"
              >
                <ResponsiveContainer height="100%" width="100%">
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={data.categoryBreakdown}
                      dataKey="amount"
                      innerRadius="50%"
                      nameKey="category"
                      outerRadius="82%"
                      paddingAngle={3}
                      stroke="none"
                    >
                      {data.categoryBreakdown.map((item, index) => (
                        <Cell
                          fill={categoryColors[index % categoryColors.length]}
                          key={item.category}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => [formatINR(Number(value)), 'Spent']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {data.categoryBreakdown.map((item, index) => (
                  <li
                    className="flex min-w-0 items-center gap-2 text-xs text-[var(--color-text-secondary)]"
                    key={item.category}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: categoryColors[index % categoryColors.length],
                      }}
                    />
                    <span className="truncate">{item.category}</span>
                    <strong className="ml-auto tabular-nums text-[var(--color-text)] font-medium">
                      {item.percentage}%
                    </strong>
                  </li>
                ))}
              </ul>
              <p className="sr-only">{categoryDescription}</p>
            </>
          ) : (
            <EmptyState
              title="No spending in this period"
              description="Category totals will appear here when you add expenses."
            />
          )}
        </article>
      </section>

      {/* Grid: Monthly savings and Spending trend */}
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-colors">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Monthly savings</h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              Income minus expenses each month
            </p>
          </div>
          <div
            aria-label={`Monthly savings. ${trendDescription}`}
            className="h-64 w-full"
            role="img"
          >
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                data={data.monthlyTotals}
                margin={{ top: 8, right: 8, left: 2, bottom: 0 }}
              >
                <CartesianGrid stroke={colors.border} strokeOpacity={0.6} vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="month"
                  tick={axisTick}
                  tickFormatter={formatMonth}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={axisTick}
                  tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                  tickLine={false}
                  width={68}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: '#282536' }}
                  formatter={(value) => [formatINR(Number(value)), 'Savings']}
                />
                <Bar dataKey="savings" fill={colors.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="sr-only">{trendDescription || 'No savings data for this period.'}</p>
        </article>

        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-colors">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Spending trend</h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              Expenses over the last 6 months
            </p>
          </div>
          <div
            aria-label={`Spending trend over the last six months. ${data.monthlyTotals
              .map((item) => `${formatMonth(item.month)}: ${formatINR(item.expenses)}`)
              .join('. ')}`}
            className="h-64 w-full"
            role="img"
          >
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart
                data={data.monthlyTotals}
                margin={{ top: 8, right: 8, left: 2, bottom: 0 }}
              >
                <CartesianGrid stroke={colors.border} strokeOpacity={0.6} vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="month"
                  tick={axisTick}
                  tickFormatter={formatMonth}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={axisTick}
                  tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                  tickLine={false}
                  width={68}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [formatINR(Number(value)), 'Spent']}
                />
                <Area
                  dataKey="expenses"
                  type="monotone"
                  stroke={colors.accent}
                  strokeWidth={2}
                  fill={colors.accent}
                  fillOpacity={0.16}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="sr-only">
            {trendDescription || 'No spending history for this period.'}
          </p>
        </article>
      </section>
    </>
  )
}