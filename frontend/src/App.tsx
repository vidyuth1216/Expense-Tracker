import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { AddExpense } from './pages/AddExpense'
import { Dashboard } from './pages/Dashboard'
import { Expenses } from './pages/Expenses'
import { Income } from './pages/Income'
import { expenses as initialExpenses, incomes as initialIncomes } from './data/mockData'
import type { Expense, ExpenseInput, Income as IncomeRecord, IncomeInput } from './types/finance'

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [incomes, setIncomes] = useState<IncomeRecord[]>(initialIncomes)
  const addExpense = (expense: ExpenseInput) => setExpenses((current) => [{ ...expense, id: crypto.randomUUID() }, ...current])
  const updateExpense = (id: string, expense: ExpenseInput) => setExpenses((current) => current.map((item) => item.id === id ? { ...expense, id } : item))
  const deleteExpense = (id: string) => setExpenses((current) => current.filter((item) => item.id !== id))
  const addIncome = (income: IncomeInput) => setIncomes((current) => [{ ...income, id: crypto.randomUUID() }, ...current])
  const updateIncome = (id: string, income: IncomeInput) => setIncomes((current) => current.map((item) => item.id === id ? { ...income, id } : item))
  const deleteIncome = (id: string) => setIncomes((current) => current.filter((item) => item.id !== id))

  return <BrowserRouter><Routes><Route element={<AppShell />}><Route element={<Dashboard expenses={expenses} incomes={incomes} />} path="/" /><Route element={<Expenses expenses={expenses} onDelete={deleteExpense} onUpdate={updateExpense} />} path="/expenses" /><Route element={<AddExpense onCreate={addExpense} />} path="/expenses/new" /><Route element={<Income incomes={incomes} onCreate={addIncome} onDelete={deleteIncome} onUpdate={updateIncome} />} path="/income" /></Route></Routes></BrowserRouter>
}

export default App
