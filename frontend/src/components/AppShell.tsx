import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Icon } from './Icon'
import { Sidebar } from './Sidebar'
import { ThemeToggle } from './ThemeToggle'

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mobileLinks = [
    ['/', 'grid', 'Overview'],
    ['/expenses', 'receipt', 'Expenses'],
    ['/income', 'wallet', 'Income'],
    ['/budgets', 'chart', 'Budgets'],
    ['/analytics', 'chart', 'Analytics'],
    ['/settings', 'settings', 'Settings'],
  ] as const

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)] lg:flex">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header: Brand wordmark, NO lime square */}
        <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-5 py-3.5 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-2">
            <span className="brand-wordmark text-xl font-normal tracking-tight text-[var(--color-text)]">
              everyday<span className="text-[var(--color-accent)]">.</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <button
              aria-expanded={mobileNavOpen}
              aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
              className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)] cursor-pointer"
              onClick={() => setMobileNavOpen((open) => !open)}
              type="button"
            >
              <Icon name={mobileNavOpen ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        </header>

        {/* Mobile Nav Dropdown */}
        {mobileNavOpen && (
          <nav className="fixed inset-x-0 top-[57px] z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-2xl lg:hidden">
            <div className="grid gap-1">
              {mobileLinks.map(([to, icon, label]) => (
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)]'
                    }`
                  }
                  end={to === '/'}
                  key={to}
                  onClick={() => setMobileNavOpen(false)}
                  to={to}
                >
                  <Icon name={icon} size={18} />
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}

        {/* Main Content Area */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 pb-28 lg:pb-10">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-6 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 py-2 backdrop-blur-md lg:hidden">
          <NavLink
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
              }`
            }
            end
            to="/"
          >
            <Icon name="grid" size={18} />
            Overview
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
              }`
            }
            to="/expenses"
          >
            <Icon name="receipt" size={18} />
            Expenses
          </NavLink>
          <NavLink
            aria-label="Add expense"
            className="mx-auto grid h-11 w-11 -translate-y-3 place-items-center rounded-full bg-[var(--color-accent)] text-white shadow-[0_4px_16px_rgba(155,138,251,0.4)] transition-all hover:brightness-110 active:scale-95"
            to="/expenses/new"
          >
            <Icon name="plus" size={20} />
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
              }`
            }
            to="/budgets"
          >
            <Icon name="chart" size={18} />
            Budgets
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
              }`
            }
            to="/analytics"
          >
            <Icon name="chart" size={18} />
            Analytics
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
              }`
            }
            to="/settings"
          >
            <Icon name="settings" size={18} />
            Settings
          </NavLink>
        </nav>
      </div>
    </div>
  )
}
