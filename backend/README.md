# Backend

Node.js, Express, TypeScript, and Prisma backend for the Expense Tracker.

Run `npm install` followed by `npm run dev` from this directory.

## Architecture

Requests flow through `routes`, `controllers`, and `services`. Services are the boundary for Prisma and database operations.

```text
Route -> Controller -> Service -> Prisma -> PostgreSQL
```

The application also provides JSON parsing, CORS, centralized errors, and JSON 404 responses.

Environment variables:

- `PORT` (default: `3000`)
- `CORS_ORIGIN` (default: `http://localhost:5173`)
- `DATABASE_URL` (used by Prisma)
- `JWT_SECRET` (at least 32 random characters; used to sign authentication cookies)

Authentication uses an `httpOnly` signed JWT cookie named `expense_tracker_token`. Configure `JWT_SECRET` before starting the backend.

## Authentication API

`POST /api/auth/register` and `POST /api/auth/login` set the authentication cookie. `POST /api/auth/logout` clears it. `GET /api/auth/me` returns the authenticated user without the password hash.

### `POST /api/auth/register`

Request:

```json
{
	"name": "Jordan Lee",
	"email": "jordan@example.com",
	"password": "correct horse battery staple"
}
```

Response (`201`):

```json
{
	"data": {
		"user": {
			"id": "11111111-1111-4111-8111-111111111111",
			"name": "Jordan Lee",
			"email": "jordan@example.com",
			"currency": "INR"
		}
	}
}
```

### `POST /api/auth/login`

Request: `{ "email": "jordan@example.com", "password": "correct horse battery staple" }`

Response (`200`): `{ "data": { "user": { "id": "11111111-1111-4111-8111-111111111111", "name": "Jordan Lee", "email": "jordan@example.com", "currency": "INR" } } }`

### `POST /api/auth/logout`

Response (`200`): `{ "data": { "loggedOut": true } }`

### `GET /api/auth/me`

Response (`200`): `{ "data": { "user": { "id": "11111111-1111-4111-8111-111111111111", "name": "Jordan Lee", "email": "jordan@example.com", "currency": "INR" } } }`

Invalid credentials return `401`, duplicate emails return `409`, and validation failures return `400`. All private dashboard, expense, and income routes require the authentication cookie; the user ID is taken from the verified token, never from a request header or body.

## Expense API

All expense endpoints require the authentication cookie. Request bodies for `POST` and `PUT` contain `amount`, `categoryId`, `description`, `paymentMethod`, and `date` (`YYYY-MM-DD`). `PUT` replaces all expense fields.

Success responses use `{ "data": ... }`. Errors use `{ "error": { "code": "...", "message": "..." } }`.

### `GET /api/expenses`

Request:

```http
GET /api/expenses
```

Response (`200`):

```json
{
	"data": [{
		"id": "22222222-2222-4222-8222-222222222222",
		"amount": 42.5,
		"categoryId": "33333333-3333-4333-8333-333333333333",
		"description": "Groceries",
		"paymentMethod": "Credit card",
		"date": "2026-09-23",
		"createdAt": "2026-09-23T10:00:00.000Z",
		"updatedAt": "2026-09-23T10:00:00.000Z"
	}]
}
```

### `GET /api/expenses/:id`

Request: `GET /api/expenses/22222222-2222-4222-8222-222222222222`

Response (`200`): `{ "data": { "id": "22222222-2222-4222-8222-222222222222", "amount": 42.5, "categoryId": "33333333-3333-4333-8333-333333333333", "description": "Groceries", "paymentMethod": "Credit card", "date": "2026-09-23", "createdAt": "2026-09-23T10:00:00.000Z", "updatedAt": "2026-09-23T10:00:00.000Z" } }`

### `POST /api/expenses`

Request body:

```json
{
	"amount": 42.5,
	"categoryId": "33333333-3333-4333-8333-333333333333",
	"description": "Groceries",
	"paymentMethod": "Credit card",
	"date": "2026-09-23"
}
```

Response (`201`): `{ "data": { "id": "22222222-2222-4222-8222-222222222222", "amount": 42.5, "categoryId": "33333333-3333-4333-8333-333333333333", "description": "Groceries", "paymentMethod": "Credit card", "date": "2026-09-23", "createdAt": "2026-09-23T10:00:00.000Z", "updatedAt": "2026-09-23T10:00:00.000Z" } }`

### `PUT /api/expenses/:id`

Request body:

```json
{
	"amount": 45,
	"categoryId": "33333333-3333-4333-8333-333333333333",
	"description": "Updated groceries",
	"paymentMethod": "Debit card",
	"date": "2026-09-23"
}
```

Response (`200`): `{ "data": { "id": "22222222-2222-4222-8222-222222222222", "amount": 45, "categoryId": "33333333-3333-4333-8333-333333333333", "description": "Updated groceries", "paymentMethod": "Debit card", "date": "2026-09-23", "createdAt": "2026-09-23T10:00:00.000Z", "updatedAt": "2026-09-23T10:05:00.000Z" } }`

### `DELETE /api/expenses/:id`

Request: `DELETE /api/expenses/22222222-2222-4222-8222-222222222222`

Response (`200`): `{ "data": { "id": "22222222-2222-4222-8222-222222222222", "deleted": true } }`

Missing expenses return `404`, invalid input and category IDs return `400`, and unexpected database failures return `500` without exposing database details.

## Budget API

All budget endpoints require the authentication cookie. Request bodies for `POST` and `PUT` contain `amount`, `categoryId`, and `month` (`YYYY-MM`). A user can have one budget per category and month.

### `GET /api/budgets`

Returns all budgets, newest month first. Pass `?month=YYYY-MM` to limit the response to one month.

### `POST /api/budgets`

Request body: `{ "amount": 8000, "categoryId": "33333333-3333-4333-8333-333333333333", "month": "2026-09" }`

### `GET /api/budgets/:id`, `PUT /api/budgets/:id`, and `DELETE /api/budgets/:id`

These follow the same success envelope as expenses. Budget responses include `category`, `spent`, `remaining`, `progressPercentage`, and `isOverBudget`; these values are calculated from matching expense rows for the budget month and category.

Duplicate category/month budgets return `409`, missing budgets return `404`, and invalid input or category IDs return `400`.

## Dashboard API

### `GET /api/dashboard?month=9&year=2026`

Requires the authentication cookie. `month` must be `1` through `12` and `year` must be four digits. Income, expenses, savings rate, and category breakdown are scoped to the requested month. `remainingBalance` is global: all income ever recorded minus all expenses ever recorded.

Response (`200`):

```json
{
	"data": {
		"month": "2026-09",
		"totalIncome": 2500,
		"totalExpenses": 725.5,
		"remainingBalance": 1774.5,
		"savingsRate": 70.98,
		"expenseBreakdown": [
			{
				"categoryId": "33333333-3333-4333-8333-333333333333",
				"category": "Food",
				"amount": 425.5,
				"percentage": 58.65
			}
		],
		"recentExpenses": [
			{
				"id": "22222222-2222-4222-8222-222222222222",
				"amount": 42.5,
				"categoryId": "33333333-3333-4333-8333-333333333333",
				"category": "Food",
				"description": "Groceries",
				"paymentMethod": "Credit card",
				"date": "2026-09-23",
				"createdAt": "2026-09-23T10:00:00.000Z",
				"updatedAt": "2026-09-23T10:00:00.000Z"
			}
		],
		"sixMonthHistory": [
			{ "month": "2026-05", "amount": 610 },
			{ "month": "2026-06", "amount": 540 },
			{ "month": "2026-07", "amount": 820 },
			{ "month": "2026-08", "amount": 675 },
			{ "month": "2026-09", "amount": 725.5 }
		]
	}
}
```

`totalIncome`, `totalExpenses`, `remainingBalance`, and category/month amounts are numbers in the user’s currency. `savingsRate` is the requested month’s unspent income percentage, rounded to two decimals, or `0` when monthly income is zero. `expenseBreakdown` is sorted by amount descending and percentages sum to approximately `100`. `recentExpenses` contains up to five expenses from the requested month, newest first. `sixMonthHistory` contains the requested month and the five preceding months, including zero-value months.

Invalid or missing `month` returns `400`:

```json
{
	"error": {
		"code": "INVALID_MONTH",
		"message": "month must be a number from 1 to 12"
	}
}
```

TypeScript types:

```ts
export type DashboardExpenseCategory = {
	categoryId: string
	category: string
	amount: number
	percentage: number
}

export type DashboardRecentExpense = ExpenseResponse & {
	category: string
}

export type DashboardMonthlySpending = {
	month: string
	amount: number
}

export type DashboardResponse = {
	month: string
	totalIncome: number
	totalExpenses: number
	remainingBalance: number
	savingsRate: number
	expenseBreakdown: DashboardExpenseCategory[]
	recentExpenses: DashboardRecentExpense[]
	sixMonthHistory: DashboardMonthlySpending[]
}
```
