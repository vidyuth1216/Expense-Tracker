import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { Card, Button } from '../components/ui'
import { Icon } from '../components/Icon'

export function Settings() {
  const { user, logout } = useAuth()

  return (
    <>
      <PageHeader
        eyebrow="Workspace / preferences"
        title="Settings"
        description="Manage your account preferences and workspace details."
      />
      <div className="grid max-w-4xl gap-5 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-[var(--color-text)]">Account</h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Your profile information</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Name
              </label>
              <input
                className="mt-1.5 h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 px-3.5 text-sm text-[var(--color-text)] outline-none"
                readOnly
                value={user?.name ?? ''}
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Email
              </label>
              <input
                className="mt-1.5 h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 px-3.5 text-sm text-[var(--color-text)] outline-none"
                readOnly
                value={user?.email ?? ''}
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Currency
              </label>
              <div className="relative mt-1.5">
                <select
                  aria-label="Currency"
                  className="h-10 w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 px-3.5 pr-10 text-sm text-[var(--color-text)] outline-none cursor-default"
                  disabled
                  value={user?.currency ?? 'INR'}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                  <Icon name="chevron" size={15} />
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative flex flex-col justify-between overflow-hidden p-5 sm:p-6 min-h-[220px]">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text)]">Session</h2>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Sign out of this device</p>
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => void logout()}
                type="button"
              >
                Sign out
              </Button>
            </div>
          </div>

          {/* Decorative Sparkle Watermark matching reference */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-4 text-[var(--color-text-muted)] opacity-20"
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        </Card>
      </div>
    </>
  )
}
