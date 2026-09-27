import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { Card, Button } from '../components/ui'

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
          <dl className="mt-6 grid gap-4 text-sm">
            <div className="border-b border-[var(--color-border-subtle)] pb-3">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Name
              </dt>
              <dd className="mt-1 font-medium text-[var(--color-text)]">{user?.name}</dd>
            </div>
            <div className="border-b border-[var(--color-border-subtle)] pb-3">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Email
              </dt>
              <dd className="mt-1 break-words font-medium text-[var(--color-text)]">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Currency
              </dt>
              <dd className="mt-1 font-medium text-[var(--color-text)]">{user?.currency ?? 'INR'}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text)]">Session</h2>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Sign out of this device</p>
            <p className="mt-4 text-xs text-[var(--color-text-secondary)]">
              Terminates your current active session on this browser. You can sign back in anytime.
            </p>
          </div>
          <div className="pt-6">
            <Button
              variant="destructive"
              onClick={() => void logout()}
              type="button"
            >
              Sign out
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
