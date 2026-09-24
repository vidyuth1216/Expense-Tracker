import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'

export function Settings() {
  const { user, logout } = useAuth()

  return <>
    <PageHeader eyebrow="Workspace / preferences" title="Settings" description="Manage your account preferences and workspace details." />
    <div className="grid max-w-4xl gap-5 lg:grid-cols-2">
      <section className="rounded-2xl border border-white/8 bg-[#151818] p-5 sm:p-6">
        <h2 className="font-semibold text-white">Account</h2>
        <p className="mt-1 text-sm text-[#78837d]">Your profile information</p>
        <dl className="mt-6 grid gap-4 text-sm">
          <div className="border-b border-white/8 pb-4"><dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#78837d]">Name</dt><dd className="mt-1 text-[#e5e9e4]">{user?.name}</dd></div>
          <div className="border-b border-white/8 pb-4"><dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#78837d]">Email</dt><dd className="mt-1 break-words text-[#e5e9e4]">{user?.email}</dd></div>
          <div><dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#78837d]">Currency</dt><dd className="mt-1 text-[#e5e9e4]">{user?.currency ?? 'INR'}</dd></div>
        </dl>
      </section>
      <section className="rounded-2xl border border-white/8 bg-[#151818] p-5 sm:p-6">
        <h2 className="font-semibold text-white">Session</h2>
        <p className="mt-1 text-sm text-[#78837d]">Sign out of this device</p>
        <button className="mt-6 min-h-11 rounded-xl border border-[#ff9b70]/30 px-4 py-3 text-sm font-semibold text-[#ffb18f] hover:bg-[#ff9b70]/10" onClick={() => void logout()} type="button">Sign out</button>
      </section>
    </div>
  </>
}
