import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatINR } from '../types/finance'

type ChartPlaceholderProps = { type: 'donut' | 'bars'; data: Array<{ label?: string; value?: number; color?: string; month?: string; amount?: number }>; total?: number }

const tooltipStyle = { backgroundColor: '#202525', border: '1px solid #3a4540', borderRadius: 10, color: '#eef1ec' }

export function ChartPlaceholder({ type, data, total = 0 }: ChartPlaceholderProps) {
  if (type === 'donut') return <div aria-label="Expense breakdown donut chart" className="h-52 w-full max-w-[230px]" role="img"><ResponsiveContainer height="100%" width="100%"><PieChart><Pie cx="50%" cy="50%" data={data} dataKey="value" innerRadius="62%" outerRadius="88%" paddingAngle={3} stroke="none">{data.map((item) => <Cell fill={item.color} key={item.label} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Share']} /></PieChart></ResponsiveContainer><div className="pointer-events-none relative -mt-[132px] text-center"><strong className="block text-2xl">{formatINR(total)}</strong><span className="text-[10px] text-[#7f8983]">total spent</span></div></div>
  return <div aria-label="Monthly spending bar chart" className="h-52 w-full" role="img"><ResponsiveContainer height="100%" width="100%"><BarChart data={data} margin={{ top: 8, right: 0, left: -22, bottom: 0 }}><XAxis axisLine={false} dataKey="month" tick={{ fill: '#68736d', fontSize: 10 }} tickLine={false} /><YAxis axisLine={false} tick={{ fill: '#68736d', fontSize: 10 }} tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} tickLine={false} width={58} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#ffffff', opacity: 0.04 }} formatter={(value) => [formatINR(Number(value)), 'Spent']} /><Bar dataKey="amount" fill="#557d50" radius={[5, 5, 0, 0]} activeBar={{ fill: '#c9f36a' }} /></BarChart></ResponsiveContainer></div>
}
