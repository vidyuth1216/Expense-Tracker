import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { useAuth } from '../context/AuthContext'

type PageHeaderProps = { eyebrow?: string; title: string; description?: string; action?: ReactNode }

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
    <div>
      {eyebrow && <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7faaa0]">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">{title}</h1>
      {description && <p className="mt-2 text-sm text-[#858d89]">{description}</p>}
    </div>
    {action}
  </header>
}

export function UserProfile() {
  const { user } = useAuth()
  const initials = user?.name.slice(0, 2).toUpperCase() ?? 'ME'
  return <div className="hidden items-center gap-3 border-l border-white/10 pl-5 sm:flex"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#4ecdc4] text-sm font-bold text-[#102222]">{initials}</div><div><p className="text-sm font-semibold text-white">{user?.name ?? 'Account'}</p><p className="text-xs text-[#78837d]">{user?.email ?? 'Personal account'}</p></div><Icon name="chevron" size={15} /></div>
}

export function MonthPicker() {
  return <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#171a1a] px-4 py-2.5 text-sm font-medium text-[#dce1dd]" type="button">September 2024 <Icon name="chevron" size={15} /></button>
}
