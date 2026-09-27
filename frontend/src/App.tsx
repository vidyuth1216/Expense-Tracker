import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AddExpense } from './pages/AddExpense'
import { Dashboard } from './pages/Dashboard'
import { Expenses } from './pages/Expenses'
import { Income } from './pages/Income'
import { getApiErrorMessage } from './services/api'
import { getDashboardRecords } from './services/dashboardService'
import { createExpense, deleteExpense, updateExpense } from './services/expenseService'
import { createIncome, deleteIncome, updateIncome } from './services/incomeService'
import type { Expense, ExpenseInput, Income as IncomeRecord, IncomeInput } from './types/finance'
import { AuthPage } from './pages/AuthPage'
import { Settings } from './pages/Settings'
import { Budgets } from './pages/Budgets'
import { Analytics } from './pages/Analytics'

function PrivateApp() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<IncomeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [dashboardRefreshToken, setDashboardRefreshToken] = useState(0)

  const refreshData = async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await getDashboardRecords()
      setExpenses(data.expenses)
      setIncomes(data.incomes)
      setDashboardRefreshToken((token) => token + 1)
      setError('')
    } catch {
      setLoadError('Unable to load your data. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const { user } = useAuth()
  useEffect(() => {
    if (user) void refreshData()
  }, [user])

  useEffect(() => {
    if (!notice && !error) return
    const timeout = window.setTimeout(() => {
      setNotice('')
      setError('')
    }, 4500)
    return () => window.clearTimeout(timeout)
  }, [notice, error])

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

  const addExpense = (expense: ExpenseInput) =>
    runMutation(async () => {
      await createExpense(expense)
    }, 'Expense saved successfully.')

  const editExpense = (id: string, expense: ExpenseInput) =>
    runMutation(async () => {
      await updateExpense(id, expense)
    }, 'Expense updated successfully.')

  const removeExpense = (id: string) => {
    if (!window.confirm('Delete this expense? This action cannot be undone.')) return Promise.resolve()
    return runMutation(async () => {
      await deleteExpense(id)
    }, 'Expense deleted successfully.')
  }

  const addIncome = (income: IncomeInput) =>
    runMutation(async () => {
      await createIncome(income)
    }, 'Income saved successfully.')

  const editIncome = (id: string, income: IncomeInput) =>
    runMutation(async () => {
      await updateIncome(id, income)
    }, 'Income updated successfully.')

  const removeIncome = (id: string) =>
    runMutation(async () => {
      await deleteIncome(id)
    }, 'Income deleted successfully.')

  return (
    <>
      <div
        aria-live="polite"
        className="fixed right-4 top-4 z-50 w-[min(24rem,calc(100vw-2rem))] space-y-2"
      >
        {error && (
          <div
            className="rounded-xl border border-[var(--color-negative)]/30 bg-[var(--color-surface-elevated)] px-4 py-3 text-sm text-[var(--color-negative)] shadow-xl"
            role="alert"
          >
            {error}
          </div>
        )}
        {notice && (
          <div
            className="rounded-xl border border-[var(--color-positive)]/30 bg-[var(--color-surface-elevated)] px-4 py-3 text-sm text-[var(--color-positive)] shadow-xl"
            role="status"
          >
            {notice}
          </div>
        )}
      </div>
      <Routes>
        <Route element={<AppShell />}>
          <Route element={<Dashboard refreshToken={dashboardRefreshToken} />} path="/" />
          <Route
            element={
              <Expenses
                expenses={expenses}
                loading={loading}
                loadError={loadError}
                onDelete={removeExpense}
                onRetry={refreshData}
                onUpdate={editExpense}
              />
            }
            path="/expenses"
          />
          <Route element={<AddExpense onCreate={addExpense} />} path="/expenses/new" />
          <Route
            element={
              <Income
                incomes={incomes}
                loading={loading}
                loadError={loadError}
                onCreate={addIncome}
                onDelete={removeIncome}
                onRetry={refreshData}
                onUpdate={editIncome}
              />
            }
            path="/income"
          />
          <Route element={<Budgets />} path="/budgets" />
          <Route element={<Analytics />} path="/analytics" />
          <Route element={<Settings />} path="/settings" />
        </Route>
      </Routes>
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AuthPage mode="login" />} path="/login" />
              <Route element={<AuthPage mode="register" />} path="/register" />
              <Route element={<ProtectedRoute />}>
                <Route element={<PrivateApp />} path="/*" />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
