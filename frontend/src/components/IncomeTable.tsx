import { useState } from 'react'
import { formatINR, type Income, type IncomeInput } from '../types/finance'
import { IncomeForm } from './IncomeForm'
import { Icon } from './Icon'

export function IncomeTable({
  incomes,
  onUpdate,
  onDelete,
}: {
  incomes: Income[]
  onUpdate: (id: string, income: IncomeInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [editing, setEditing] = useState<Income | null>(null)
  const sortedIncomes = [...incomes].sort((a, b) => b.date.localeCompare(a.date))

  if (!sortedIncomes.length) {
    return (
      <div className="px-5 py-16 text-center">
        <p className="text-base font-semibold text-[var(--color-text)]">No income recorded</p>
        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
          Add your first income entry to start tracking your balance.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      {editing && (
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-text)]">Editing income</p>
            <button
              aria-label="Close edit form"
              className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] cursor-pointer"
              onClick={() => setEditing(null)}
              type="button"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
          <IncomeForm
            initialIncome={editing}
            onCancel={() => setEditing(null)}
            onSubmit={async (income) => {
              await onUpdate(editing.id, income)
              setEditing(null)
            }}
          />
        </div>
      )}

      <table className="w-full min-w-[580px] text-left">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border-subtle)]">
          {sortedIncomes.map((income) => (
            <tr
              className="group transition-colors hover:bg-[var(--color-surface-secondary)]/50"
              key={income.id}
            >
              <td className="whitespace-nowrap px-4 py-3.5 text-xs text-[var(--color-text-muted)]">
                {new Date(`${income.date}T12:00:00`).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-[var(--color-text)]">
                {income.source}
              </td>
              <td className="px-4 py-3.5 text-sm text-[var(--color-text-secondary)]">
                {income.description || 'No description'}
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-[var(--color-positive)]">
                +{formatINR(income.amount)}
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    aria-label={`Edit ${income.source}`}
                    className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                    onClick={() => setEditing(income)}
                    type="button"
                  >
                    <Icon name="edit" size={15} />
                  </button>
                  <button
                    aria-label={`Delete ${income.source}`}
                    className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-negative)]/10 hover:text-[var(--color-negative)] transition-colors cursor-pointer"
                    onClick={() =>
                      window.confirm(`Delete ${income.source} income?`) && onDelete(income.id)
                    }
                    type="button"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
