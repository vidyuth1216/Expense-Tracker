type StateMessageProps = {
  title: string
  description: string
  action?: { label: string; onClick: () => void } | (() => void)
}

export function ErrorState({ title = 'Unable to load data. Try again.', description = 'We could not retrieve this information right now.', action }: Partial<StateMessageProps>) {
  const actionDetails = typeof action === 'function' ? { label: 'Try again', onClick: action } : action
  return <div className="rounded-2xl border border-[#ff9b70]/25 bg-[#321e1a]/60 px-5 py-12 text-center">
    <p className="text-lg font-semibold text-[#ffb18f]">{title}</p>
    <p className="mt-2 text-sm text-[#c28f7f]">{description}</p>
    {actionDetails && <button className="mt-5 min-h-11 rounded-xl border border-[#ff9b70]/30 px-4 py-2.5 text-sm font-semibold text-[#ffb18f] hover:bg-[#ff9b70]/10" onClick={actionDetails.onClick} type="button">{actionDetails.label}</button>}
  </div>
}

export function EmptyState({ title, description, action }: StateMessageProps) {
  const actionDetails = typeof action === 'function' ? { label: 'Try again', onClick: action } : action
  return <div className="rounded-2xl border border-dashed border-white/10 px-5 py-12 text-center">
    <p className="text-lg font-semibold text-white">{title}</p>
    <p className="mt-2 text-sm text-[#78837d]">{description}</p>
    {actionDetails && <button className="mt-5 min-h-11 rounded-xl bg-[#d5f477] px-4 py-2.5 text-sm font-bold text-[#16210f] hover:bg-[#e3ff93]" onClick={actionDetails.onClick} type="button">{actionDetails.label}</button>}
  </div>
}

export function TableSkeleton({ columns = 5 }: { columns?: number }) {
  return <div aria-label="Loading records" className="space-y-3 p-5" role="status">
    {Array.from({ length: 5 }, (_, row) => <div className="grid gap-4 sm:grid-cols-5" key={row}>{Array.from({ length: columns }, (_, column) => <div className="h-5 animate-pulse rounded bg-white/8" key={column} />)}</div>)}
  </div>
}

export function DashboardSkeleton() {
  return <div aria-label="Loading dashboard" className="space-y-5" role="status">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div className="h-36 animate-pulse rounded-2xl bg-white/8" key={index} />)}</div>
    <div className="grid gap-5 xl:grid-cols-2"><div className="h-72 animate-pulse rounded-2xl bg-white/8" /><div className="h-72 animate-pulse rounded-2xl bg-white/8" /></div>
    <div className="h-64 animate-pulse rounded-2xl bg-white/8" />
  </div>
}
