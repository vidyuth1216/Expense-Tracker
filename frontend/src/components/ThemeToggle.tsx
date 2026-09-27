import { useTheme } from '../context/ThemeContext'
import { Icon } from './Icon'

interface ThemeToggleProps {
  className?: string
  compact?: boolean
}

export function ThemeToggle({ className = '', compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme, isMidnight } = useTheme()

  if (compact) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isMidnight}
        aria-label={`Current theme is ${theme.toUpperCase()}. Switch to ${isMidnight ? 'Neon' : 'Midnight'}.`}
        onClick={toggleTheme}
        className={`group relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] transition-all duration-200 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-secondary)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${className}`}
      >
        {isMidnight ? (
          <Icon name="moon" size={16} className="text-[#B8B4D8] transition-transform duration-200 group-hover:scale-110" />
        ) : (
          <Icon name="sun" size={17} className="text-[#7C3AED] transition-transform duration-200 group-hover:rotate-45" />
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isMidnight}
      aria-label={`Theme toggle: Currently ${isMidnight ? 'Midnight' : 'Neon'}. Click to toggle.`}
      onClick={toggleTheme}
      className={`group relative flex h-11 w-40 cursor-pointer select-none items-center justify-between rounded-full border px-1.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
        isMidnight
          ? 'border-[#262934] bg-[#14161E] shadow-[inset_0_3px_6px_rgba(0,0,0,0.65),inset_0_-1px_2px_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.3)]'
          : 'border-[#D1D5DB] bg-[#E5E8ED] shadow-[inset_0_3px_6px_rgba(0,0,0,0.12),inset_0_-1px_2px_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.05)]'
      } ${className}`}
    >
      {/* Sliding Physical Thumb */}
      <span
        aria-hidden="true"
        className={`absolute top-1 flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] ${
          isMidnight
            ? 'translate-x-[116px] border border-[#383C49] bg-[#262934] text-[#C5C2E0] shadow-[0_3px_7px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.16)]'
            : 'translate-x-0 border border-[#E5E7EB] bg-white text-[#7C3AED] shadow-[0_3px_7px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,1)]'
        }`}
      >
        {isMidnight ? (
          <Icon name="moon" size={18} className="text-[#C4C0DF] transition-transform duration-200 group-hover:scale-105" />
        ) : (
          <Icon name="sun" size={19} className="text-[#7C3AED] transition-transform duration-200 group-hover:rotate-45" />
        )}
      </span>

      {/* Label for Midnight */}
      <span
        className={`flex-1 pl-4 text-left transition-opacity duration-200 ${
          isMidnight ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <span className="block font-sans text-[11px] font-semibold tracking-[0.16em] text-[#ECEBF3]">
          MIDNIGHT
        </span>
      </span>

      {/* Label for Neon */}
      <span
        className={`flex-1 pr-4 text-right transition-opacity duration-200 ${
          !isMidnight ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <span className="block font-sans text-xs font-bold tracking-[0.14em] text-[#111827]">
          NEON
        </span>
      </span>
    </button>
  )
}
