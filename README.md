# Expense Tracker

Initial full-stack project foundation for an Expense Tracker application.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database layer: PostgreSQL with Prisma ORM

No application features have been implemented yet. The frontend contains only a startup screen, and the backend exposes only a health check so both projects can be run independently.

## Prerequisites

Install Node.js 20 or newer, which includes npm. A PostgreSQL server is only required when you begin using Prisma migrations or database access; it is not required to start the current backend.

## Setup

Run these commands from the repository root:

```powershell
cd frontend
npm install
cd ..\backend
npm install
cd ..
```

`npm install` reads each package manifest and installs the exact frontend or backend dependency set into its local `node_modules` directory.

Copy the environment templates when you need local configuration:

```powershell
Copy-Item frontend\.env.example frontend\.env
Copy-Item backend\.env.example backend\.env
```

The frontend environment file defines the future API base URL. The backend environment file defines the PostgreSQL connection string and HTTP port. Do not commit the copied `.env` files.

## Run independently

Start the frontend in one terminal:

```powershell
cd frontend
npm run dev
```

`npm run dev` starts Vite's development server, normally at `http://localhost:5173`.

Start the backend in a second terminal:

```powershell
cd backend
npm run dev
```

`npm run dev` starts the TypeScript Express server with automatic reload, normally at `http://localhost:3000`. The current `/health` endpoint returns `{ "status": "ok" }`.

## Production builds

```powershell
cd frontend
npm run build
cd ..\backend
npm run build
npm start
```

The frontend build type-checks and bundles the Vite app. The backend build compiles TypeScript into `backend/dist`, and `npm start` runs the compiled server.

## Prisma

After PostgreSQL is available and `backend/.env` contains a valid `DATABASE_URL`:

```powershell
cd backend
npm run prisma:generate
npm run prisma:migrate -- --name init
```

`prisma:generate` creates the Prisma client from the schema. The migration command creates the initial database migration; the schema is intentionally empty until application models are designed.
