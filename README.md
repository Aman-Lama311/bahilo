# A4 Paper Usage Tracker

A multi-tenant SaaS application for tracking A4 paper usage — and now
notebook/copy distribution — across schools. Built as a real solution
for the school I work at, architected so any school can be onboarded
with zero code changes or redeployment.

## Problem

Schools print constantly with no visibility into how much paper is used,
by whom, or why — stock runs out unexpectedly and usage trends stay
invisible. Alongside this, notebook/copy distribution to students was
tracked entirely by hand in a paper register, class by class, with no
way to know how much stock was actually left.

## Features

- **Multi-tenant architecture** — every school isolated via `schoolId`,
  enforced centrally through middleware; platform owner onboards a new
  school in one API call
- **Auth & permissions** — JWT-based, permission-driven (not fixed roles)
- **Password recovery** — self-service change-password, plus OTP-based
  forgot-password/reset-password (6-digit email code, 10-minute expiry)
- **User management** — school admins create staff, assign granular
  permissions, update/delete accounts
- **Master data** — Classes, Sections, Teachers, Departments; single,
  bulk-create, and bulk-update for all four
- **Print tracking** — every job logged as teaching (class/section/teacher)
  or non-teaching (department), never both, never neither
- **Paper stock ledger** — current stock via aggregation: sheets in −
  sheets used
- **Reports** — by-class, by-teacher, monthly trend, by-purpose breakdown
- **CSV export** — print logs and stock entries
- **Monthly auto-email** — each school's usage summary sent automatically
  to its own principal, via a scheduled job
- **Notebook/Copy Register module** — digitizes the handwritten
  distribution register:
  - **Students** — lightweight per-school records (name, class, section,
    optional external ID)
  - **Notebook types** — dynamic, admin-managed catalog (A4 Long, Small
    Nepali/Samajik, etc.)
  - **Notebook issues** — who took what, how many, and why; full CRUD,
    filterable, with per-student running totals
  - **Reasons catalog** — dynamic dropdown-plus-"Other" source for issue
    reasons
  - **Notebook stock** — received vs. issued per type, mirrors the paper
    stock ledger

### Planned
Low-stock alerts · class/section-level notebook reports · React +
Recharts frontend (UI/UX mockups first)

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

| Area | Status |
|---|---|
| 1 — Foundation (auth, multi-tenancy) | ✅ |
| 2 — User Management | ✅ |
| 3 — Master Data (real school data, bulk create + update) | ✅ |
| 4 — Print Log | ✅ |
| 5 — Stock Ledger | ✅ |
| 6 — Reports | ✅ |
| 7 — CSV Export | ✅ |
| 8 — Monthly Email | ✅ |
| Password reset (change + OTP forgot-password) | ✅ |
| Notebook module — Student | ✅ |
| Notebook module — NotebookType | ✅ |
| Notebook module — NotebookIssue (+ update/delete) | ✅ |
| Notebook module — NotebookReason | ✅ |
| Notebook module — NotebookStock | ✅ |
| UI/UX mockups | 🚧 next |
| Frontend (React + Recharts) | ⏳ after UI/UX |

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

Backend is fully complete: the original 8-phase paper-tracking system
plus a full Notebook/Copy Register module (students, notebook types,
issue logging, reasons catalog, and stock tracking) — all bulk-capable
where it makes sense, all tested end-to-end against real school data.
Next: UI/UX mockups, then the React frontend.