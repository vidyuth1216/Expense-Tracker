import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { to: '/', label: 'Overview', icon: 'grid' as const },
  { to: '/expenses', label: 'Expenses', icon: 'receipt' as const },
  { to: '/income', label: 'Income', icon: 'wallet' as const },
  { to: '/budgets', label: 'Budgets', icon: 'chart' as const },
  { to: '/analytics', label: 'Analytics', icon: 'chart' as const },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-6 backdrop-blur-xl transition-colors lg:flex">
      {/* Brand Header */}
      <div className="flex items-center gap-2 px-2">
        <div className="brand-wordmark text-2xl font-serif text-[var(--color-brand)]">
          everyday.
        </div>
      </div>

      {/* Navigation Links */}
      <div className="mt-8">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Workspace
        </p>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)]'
                }`
              }
              end={link.to === '/'}
              to={link.to}
            >
              <Icon name={link.icon} size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section with ThemeToggle & User Profile */}
      <div className="mt-auto space-y-4 pt-6">
        {/* Mounted ThemeToggle */}
        <div className="flex justify-center px-1">
          <ThemeToggle />
        </div>

        <nav>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)]'
              }`
            }
            to="/settings"
          >
            <Icon name="settings" size={18} />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* User Profile Card */}
        <div className="flex items-center gap-3 border-t border-[var(--color-border)] px-1 pt-4">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text)]">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[var(--color-text)]">{user?.name}</p>
            <p className="truncate text-[11px] text-[var(--color-text-muted)]">{user?.email}</p>
          </div>
          <button
            aria-label="Sign out"
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-negative)] transition-colors cursor-pointer"
            onClick={() => void logout()}
            type="button"
          >
            Exit
          </button>
        </div>
      </div>
    </aside>
  )
}
