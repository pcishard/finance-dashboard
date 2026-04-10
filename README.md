# FinDash - Personal Finance Dashboard

A portable, secure personal finance dashboard built with Next.js. Track your accounts, investments, and net worth from anywhere — desktop or mobile.

## Features

- **Dashboard Overview** — Net worth, cash, investments, debt breakdown at a glance
- **Account Management** — Add/edit/delete bank, savings, brokerage, crypto, credit card, and loan accounts
- **Investment Tracking** — Track stocks, crypto, ETFs with P/L per asset and portfolio totals
- **Monthly Planning** — Input income/expenses, calculate investable surplus per month and week
- **CSV Import** — Bulk-import accounts or investments from spreadsheets
- **Authentication** — Email/password login with JWT sessions
- **Mobile-Friendly** — Fully responsive with collapsible sidebar navigation

## Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Framework | Next.js 16 (App Router)            |
| Language  | TypeScript                         |
| Database  | SQLite (via Prisma + better-sqlite3) |
| Auth      | NextAuth.js v4 (Credentials + JWT) |
| Styling   | Tailwind CSS v4                    |
| Icons     | Lucide React                       |

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### 1. Install dependencies

```bash
cd finance-dashboard
npm install
```

### 2. Generate the Prisma client

```bash
npx prisma generate
```

### 3. Create the database

```bash
npx prisma migrate dev
```

### 4. Configure environment variables

A `.env` file is already included with sensible defaults. For production, update:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="change-this-to-a-random-secret-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure secret with:

```bash
openssl rand -base64 32
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create an account

Navigate to `/register` to create your first account, then start adding financial data.

## Project Structure

```
finance-dashboard/
├── prisma/
│   ├── schema.prisma          # Database models
│   ├── migrations/            # Migration files
│   └── dev.db                 # SQLite database (auto-created)
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth + registration
│   │   │   ├── accounts/      # Account CRUD
│   │   │   ├── investments/   # Investment CRUD
│   │   │   ├── planning/      # Monthly plan upsert
│   │   │   ├── dashboard/     # Aggregated dashboard data
│   │   │   └── import/        # CSV import
│   │   ├── dashboard/         # Main dashboard page
│   │   ├── accounts/          # Account management page
│   │   ├── investments/       # Investment tracking page
│   │   ├── planning/          # Monthly planning page
│   │   ├── import/            # CSV import page
│   │   ├── login/             # Login page
│   │   └── register/          # Registration page
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utilities, Prisma client, auth config
│   ├── types/                 # TypeScript type extensions
│   └── generated/             # Prisma generated client (auto-generated)
```

## Database Schema

- **User** — Authentication and ownership
- **Account** — Financial accounts with categories and balances
- **BalanceHistory** — Historical balance snapshots per account
- **Investment** — Individual investment positions with cost basis and current value
- **MonthlyPlan** — Monthly income, expenses, and savings goals

## CSV Import Format

### Accounts

```csv
name,category,balance,currency,notes
Barclays Current,bank,5000,GBP,Main account
ISA,savings,12000,GBP,Tax-free savings
```

### Investments

```csv
name,ticker,type,investedAmount,currentValue,units,currency,notes
Apple Inc,AAPL,stock,1000,1250,5,USD,Long-term hold
Bitcoin,BTC,crypto,500,780,0.01,GBP,
```

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. For production, switch to PostgreSQL (update `schema.prisma` provider and add a Prisma adapter)

### Self-hosted

```bash
npm run build
npm start
```

## Future Improvements

- **Bank API integration** (Plaid, Open Banking) for automatic balance syncing
- **Real-time price feeds** for stocks and crypto
- **Historical charts** using Recharts (already installed)
- **Push notifications** for investment thresholds
- **Multi-currency** conversion with live exchange rates
- **Data export** to CSV/PDF
- **Two-factor authentication**

## Performance Tips

- SQLite is excellent for single-user use; switch to PostgreSQL for multi-user deployments
- Add database indexes on frequently queried columns as data grows
- Use `next/image` for any future image assets
- Enable ISR (Incremental Static Regeneration) for dashboard if data freshness allows a delay
