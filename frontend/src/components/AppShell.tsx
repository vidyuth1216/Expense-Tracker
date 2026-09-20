import { NavLink, Outlet } from 'react-router-dom'
import { Icon } from './Icon'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return <div className="min-h-screen text-[#eef1ec] lg:flex">
    <Sidebar />
    <div className="min-w-0 flex-1">
      <header className="flex items-center justify-between border-b border-white/8 bg-[#0b0f0e]/80 px-5 py-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[#d5f477] font-black text-[#151814]">e</div><span className="font-semibold tracking-tight">everyday<span className="text-[#d5f477]">.</span></span></div>
        <button aria-label="Open navigation" className="rounded-lg p-2 text-[#a5ada8]" type="button"><Icon name="menu" /></button>
      </header>
      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12"><Outlet /></main>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-white/10 bg-[#101213]/95 py-2 backdrop-blur lg:hidden">
        {[['/', 'grid', 'Overview'], ['/expenses', 'receipt', 'Expenses'], ['/income', 'wallet', 'Income']].map(([to, icon, label]) => <NavLink className={({ isActive }) => `flex flex-col items-center gap-1 py-1 text-[10px] ${isActive ? 'text-[#c9f36a]' : 'text-[#818a85]'}`} end={to === '/'} key={to} to={to}><Icon name={icon as 'grid'} size={18} />{label}</NavLink>)}
      </nav>
    </div>
  </div>
}
