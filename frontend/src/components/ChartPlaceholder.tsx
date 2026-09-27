import {
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
import { formatINR } from '../types/finance'
import { useTheme } from '../context/ThemeContext'
import { ChartTooltip } from './ChartTooltip'

type ChartPlaceholderProps = {
  type: 'donut' | 'bars'
  data: Array<{
    label?: string
    value?: number
    color?: string
    month?: string
    amount?: number
  }>
  total?: number
}

export function ChartPlaceholder({ type, data, total = 0 }: ChartPlaceholderProps) {
  const { colors } = useTheme()

  if (type === 'donut') {
    return (
      <div aria-label="Expense breakdown donut chart" className="h-56 w-full max-w-[240px]" role="img">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={data}
              dataKey="value"
              innerRadius="64%"
              outerRadius="88%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((item, index) => (
                <Cell fill={item.color || colors.accent} key={item.label || index} />
              ))}
            </Pie>
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(value: any) => `${value}%`}
                />
              }
              wrapperStyle={{ outline: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none relative -mt-[140px] text-center">
          <strong className="block text-xl font-bold tracking-tight text-[var(--color-text)] tabular-nums sm:text-2xl">
            {formatINR(total)}
          </strong>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            total spent
          </span>
        </div>
      </div>
    )
  }

  return (
    <div aria-label="Monthly spending bar chart" className="h-56 w-full" role="img">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid
            stroke={colors.border}
            strokeDasharray="3 3"
            strokeOpacity={0.4}
            vertical={false}
          />
          <XAxis
            axisLine={false}
            dataKey="month"
            tick={{ fill: colors.textMuted, fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: colors.textMuted, fontSize: 11 }}
            tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
            tickLine={false}
            width={58}
          />
          <Tooltip
            content={
              <ChartTooltip
                valueFormatter={(value: any) => formatINR(Number(value))}
              />
            }
            cursor={{ fill: colors.border, opacity: 0.15 }}
            wrapperStyle={{ outline: 'none' }}
          />
          <Bar
            activeBar={{ fill: 'var(--color-primary)', opacity: 0.85 }}
            dataKey="amount"
            fill="var(--color-primary)"
            name="Spent"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
