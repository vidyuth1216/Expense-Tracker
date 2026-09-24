import { Router } from 'express'
import { createExpense, deleteExpense, getExpense, listExpenses, updateExpense } from '../controllers/expenseController.js'
import { createIncome, deleteIncome, getIncome, listIncome, updateIncome } from '../controllers/incomeController.js'
import { getHealth } from '../controllers/healthController.js'
import { getDashboard } from '../controllers/dashboardController.js'
import { login, logout, me, register } from '../controllers/authController.js'
import { requireAuthentication } from '../middleware/auth.js'
import { createCategory, listCategories } from '../controllers/categoryController.js'

export const apiRouter = Router()

apiRouter.get('/health', getHealth)
apiRouter.post('/auth/register', register)
apiRouter.post('/auth/login', login)
apiRouter.post('/auth/logout', logout)
apiRouter.get('/auth/me', requireAuthentication, me)
apiRouter.get('/dashboard', requireAuthentication, getDashboard)
apiRouter.get('/categories', requireAuthentication, listCategories)
apiRouter.post('/categories', requireAuthentication, createCategory)

apiRouter.use('/expenses', requireAuthentication)
apiRouter.get('/expenses', listExpenses)
apiRouter.get('/expenses/:id', getExpense)
apiRouter.post('/expenses', createExpense)
apiRouter.put('/expenses/:id', updateExpense)
apiRouter.delete('/expenses/:id', deleteExpense)

apiRouter.use('/income', requireAuthentication)
apiRouter.get('/income', listIncome)
apiRouter.get('/income/:id', getIncome)
apiRouter.post('/income', createIncome)
apiRouter.put('/income/:id', updateIncome)
apiRouter.delete('/income/:id', deleteIncome)