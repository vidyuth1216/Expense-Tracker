import { ExpenseForm } from '../components/ExpenseForm'
import { PageHeader } from '../components/PageHeader'
import type { ExpenseInput } from '../types/finance'

export function AddExpense({ onCreate }: { onCreate: (expense: ExpenseInput) => Promise<void> }) {
  return <><PageHeader eyebrow="Expenses / New entry" title="Add an expense" description="Keep your spending history up to date." /><ExpenseForm onSubmit={onCreate} /></>
}
