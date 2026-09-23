import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { AddExpense } from './pages/AddExpense'
import { Dashboard } from './pages/Dashboard'
import { Expenses } from './pages/Expenses'
import { Income } from './pages/Income'
import { getApiErrorMessage } from './services/api'
import { getDashboardData } from './services/dashboardService'
import { createExpense, deleteExpense, updateExpense } from './services/expenseService'
import { createIncome, deleteIncome, updateIncome } from './services/incomeService'
import type { Expense, ExpenseInput, Income as IncomeRecord, IncomeInput } from './types/finance'

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<IncomeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const refreshData = async () => {
    setLoading(true)
    try {
      const data = await getDashboardData()
      setExpenses(data.expenses)
      setIncomes(data.incomes)
      setError('')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void refreshData() }, [])

  const runMutation = async (action: () => Promise<void>, message: string) => {
    setError('')
    try {
      await action()
      await refreshData()
      setNotice(message)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
      throw requestError
    }
  }

  const addExpense = (expense: ExpenseInput) => runMutation(async () => { await createExpense(expense) }, 'Expense saved successfully.')
  const editExpense = (id: string, expense: ExpenseInput) => runMutation(async () => { await updateExpense(id, expense) }, 'Expense updated successfully.')
  const removeExpense = (id: string) => runMutation(async () => { await deleteExpense(id) }, 'Expense deleted successfully.')
  const addIncome = (income: IncomeInput) => runMutation(async () => { await createIncome(income) }, 'Income saved successfully.')
  const editIncome = (id: string, income: IncomeInput) => runMutation(async () => { await updateIncome(id, income) }, 'Income updated successfully.')
  const removeIncome = (id: string) => runMutation(async () => { await deleteIncome(id) }, 'Income deleted successfully.')

  return <BrowserRouter><div className="fixed right-4 top-4 z-50 w-[min(24rem,calc(100vw-2rem))] space-y-2">{error && <div className="rounded-xl border border-[#ff9b70]/30 bg-[#321e1a] px-4 py-3 text-sm text-[#ffb18f]" role="alert">{error}</div>}{notice && <div className="rounded-xl border border-[#d5f477]/30 bg-[#27351b] px-4 py-3 text-sm text-[#d5f477]" role="status">{notice}</div>}</div><Routes><Route element={<AppShell />}><Route element={<Dashboard expenses={expenses} incomes={incomes} loading={loading} />} path="/" /><Route element={<Expenses expenses={expenses} loading={loading} onDelete={removeExpense} onUpdate={editExpense} />} path="/expenses" /><Route element={<AddExpense onCreate={addExpense} />} path="/expenses/new" /><Route element={<Income incomes={incomes} loading={loading} onCreate={addIncome} onDelete={removeIncome} onUpdate={editIncome} />} path="/income" /></Route></Routes></BrowserRouter>
}

export default App
