import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Overview', icon: 'grid' as const },
  { to: '/expenses', label: 'Expenses', icon: 'receipt' as const },
  { to: '/income', label: 'Income', icon: 'wallet' as const },
  { to: '/budgets', label: 'Budgets', icon: 'chart' as const },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/8 bg-[#0d1311]/80 px-5 py-7 backdrop-blur-xl lg:block">
      <div className="flex items-center gap-3 px-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#d5f477] text-lg font-black text-[#151814]">e</div>
        <span className="text-lg font-semibold tracking-tight">everyday<span className="text-[#d5f477]">.</span></span>
      </div>
      <p className="mb-4 mt-14 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#707876]">Workspace</p>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink key={link.to} className={({ isActive }) => `flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition ${isActive ? 'border-[#d5f477]/30 bg-[#d5f477] text-[#151814] shadow-[0_8px_24px_rgba(213,244,119,0.12)]' : 'border-transparent text-[#8c9490] hover:bg-white/5 hover:text-white'}`} end={link.to === '/'} to={link.to}>
            <Icon name={link.icon} size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-64">
        <NavLink className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#8c9490] hover:bg-white/5 hover:text-white" to="/settings">
          <Icon name="settings" size={18} />
          Settings
        </NavLink>
        <div className="mt-5 flex items-center gap-3 border-t border-white/8 px-3 pt-5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#4ecdc4] text-sm font-bold text-[#102222]">{user?.name.slice(0, 2).toUpperCase()}</div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{user?.name}</p><p className="truncate text-xs text-[#707876]">{user?.email}</p></div>
          <button aria-label="Sign out" className="text-xs text-[#84908a] hover:text-white" onClick={() => void logout()} type="button">Exit</button>
        </div>
      </div>
    </aside>
  )
}
