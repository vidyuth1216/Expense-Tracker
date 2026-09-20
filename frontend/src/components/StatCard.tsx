import { Icon } from './Icon'

type StatCardProps = { label: string; value: string; change: string; positive?: boolean; accent?: boolean }

export function StatCard({ label, value, change, positive = true, accent = false }: StatCardProps) {
  return <article className={`rounded-2xl border p-5 ${accent ? 'border-[#d5f477]/30 bg-[#d5f477]' : 'border-white/8 bg-[#141a18]'}`}>
    <div className="flex items-start justify-between"><p className={`text-sm ${accent ? 'text-[#384329]' : 'text-[#8d9690]'}`}>{label}</p><span className={`rounded-full p-1.5 ${positive ? (accent ? 'bg-[#afd45a] text-[#294019]' : 'bg-[#263a2b] text-[#9ee48b]') : 'bg-[#3d2928] text-[#ff9d8d]'}`}><Icon name={positive ? 'arrowUp' : 'arrowDown'} size={13} /></span></div>
    <p className={`mt-7 text-2xl font-semibold tracking-[-0.04em] ${accent ? 'text-[#16210f]' : 'text-white'}`}>{value}</p>
    <p className={`mt-2 text-xs ${accent ? 'text-[#52653b]' : 'text-[#76817b]'}`}><span className={positive ? (accent ? 'font-semibold text-[#304d1f]' : 'font-semibold text-[#98da88]') : 'font-semibold text-[#ff9d8d]'}>{change}</span> vs last month</p>
  </article>
}
