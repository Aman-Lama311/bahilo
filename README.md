# A4 Paper Usage Tracker

A multi-tenant SaaS application for tracking A4 paper usage across schools.
Built as a real solution for the school I work at, architected so any
school can be onboarded with zero code changes or redeployment.

## Problem

Schools print constantly with no visibility into how much paper is used,
by whom, or why — stock runs out unexpectedly and usage trends stay invisible.

## Features

- **Multi-tenant architecture** — every school isolated via `schoolId`,
  enforced centrally through middleware; platform owner onboards a new
  school in one API call
- **Auth & permissions** — JWT-based, permission-driven (not fixed roles):
  e.g. Reception gets `CREATE_PRINTLOG` + `VIEW_PRINTLOGS` only
- **Password recovery** — self-service change-password, plus OTP-based
  forgot-password/reset-password (6-digit email code, 10-minute expiry)
- **User management** — school admins create staff, assign granular
  permissions, update/delete accounts
- **Master data** — Classes, Sections, Teachers, Departments; single or
  bulk creation
- **Print tracking** — every job logged as teaching (class/section/teacher)
  or non-teaching (department), never both, never neither
- **Stock ledger** — current stock computed automatically via aggregation:
  sheets in − sheets used
- **Reports** — by-class, by-teacher, monthly trend, by-purpose breakdown
- **CSV export** — print logs and stock entries
- **Monthly auto-email** — each school's usage summary sent automatically
  to its own principal, via a scheduled job

### Planned
Low-stock alerts · React + Recharts frontend

## Why Multi-Tenant

Every collection carries a `schoolId`; controllers never trust a client-
supplied `schoolId` — always read from the verified JWT. One school can
never reach another's data.

## Tech Stack

**Backend:** Node.js, Express, TypeScript, MongoDB Atlas, Mongoose
**Auth:** JWT, bcryptjs, permission-based authorization
**Email:** nodemailer, node-cron
**Frontend (upcoming):** React, Vite, Recharts
**Infra:** MongoDB Atlas, Render/Railway, Vercel/Netlify

## Progress

| Phase | Status |
|---|---|
| 1 — Foundation (auth, multi-tenancy) | ✅ |
| 2 — User Management | ✅ |
| 3 — Master Data (real school data populated) | ✅ |
| 4 — Print Log | ✅ |
| 5 — Stock Ledger | ✅ |
| 6 — Reports | ✅ |
| 7 — CSV Export | ✅ |
| 8 — Monthly Email | ✅ |
| Password reset (change + OTP forgot-password) | ✅ |
| Frontend (React + Recharts) | 🚧 next |

See `PROGRESS.md` for the detailed build log.

## Project Structure

```text
server/
├── config/
├── constants/
├── controllers/
├── jobs/
├── middleware/
├── models/
├── routes/
├── scripts/
├── services/
├── types/
├── utils/
└── server.ts
```

## Getting Started

```bash
git clone <repository-url>
cd server
npm install
# configure .env — see .env.example
npm run dev
```

## Status

Backend is fully complete: auth, multi-tenancy, permissions, master data,
print tracking, stock ledger, reports, CSV export, monthly email, and
password recovery. Next: the React frontend.