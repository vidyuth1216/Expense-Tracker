import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Icon } from './Icon'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mobileLinks = [['/', 'grid', 'Overview'], ['/expenses', 'receipt', 'Expenses'], ['/income', 'wallet', 'Income'], ['/budgets', 'chart', 'Budgets'], ['/settings', 'settings', 'Settings']] as const

  return <div className="min-h-screen overflow-x-hidden text-[#eef1ec] lg:flex">
    <Sidebar />
    <div className="min-w-0 flex-1">
      <header className="flex items-center justify-between border-b border-white/8 bg-[#0b0f0e]/80 px-5 py-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[#d5f477] font-black text-[#151814]">e</div><span className="font-semibold tracking-tight">everyday<span className="text-[#d5f477]">.</span></span></div>
        <button aria-expanded={mobileNavOpen} aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'} className="rounded-lg p-2 text-[#a5ada8]" onClick={() => setMobileNavOpen((open) => !open)} type="button"><Icon name={mobileNavOpen ? 'close' : 'menu'} /></button>
      </header>
      {mobileNavOpen && <nav className="fixed inset-x-0 top-[65px] z-30 border-b border-white/10 bg-[#101513] p-3 shadow-2xl lg:hidden">
        <div className="grid gap-1">{mobileLinks.map(([to, icon, label]) => <NavLink className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${isActive ? 'bg-[#d5f477] text-[#151814]' : 'text-[#aeb7b1] hover:bg-white/5'}`} end={to === '/'} key={to} onClick={() => setMobileNavOpen(false)} to={to}><Icon name={icon} size={18} />{label}</NavLink>)}</div>
      </nav>}
      <main className="mx-auto max-w-[1440px] overflow-hidden px-5 py-8 pb-28 sm:px-8 lg:px-12 lg:py-12 lg:pb-12"><Outlet /></main>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-white/10 bg-[#101213]/95 py-2 backdrop-blur lg:hidden">
        <NavLink className={({ isActive }) => `flex flex-col items-center gap-1 py-1 text-[10px] ${isActive ? 'text-[#c9f36a]' : 'text-[#818a85]'}`} end to="/"><Icon name="grid" size={18} />Overview</NavLink>
        <NavLink className={({ isActive }) => `flex flex-col items-center gap-1 py-1 text-[10px] ${isActive ? 'text-[#c9f36a]' : 'text-[#818a85]'}`} to="/expenses"><Icon name="receipt" size={18} />Expenses</NavLink>
        <NavLink aria-label="Add expense" className="mx-auto grid h-11 w-11 -translate-y-3 place-items-center rounded-full bg-[#d5f477] text-[#151814] shadow-[0_8px_24px_rgba(213,244,119,0.2)]" to="/expenses/new"><Icon name="plus" size={20} /></NavLink>
        <NavLink className={({ isActive }) => `flex flex-col items-center gap-1 py-1 text-[10px] ${isActive ? 'text-[#c9f36a]' : 'text-[#818a85]'}`} to="/budgets"><Icon name="chart" size={18} />Budgets</NavLink>
        <NavLink className={({ isActive }) => `flex flex-col items-center gap-1 py-1 text-[10px] ${isActive ? 'text-[#c9f36a]' : 'text-[#818a85]'}`} to="/settings"><Icon name="settings" size={18} />Settings</NavLink>
      </nav>
    </div>
  </div>
}
