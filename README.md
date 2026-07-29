# A4 Paper Usage Tracker

A multi-tenant SaaS application to track paper (A4) usage across schools —
built as a real solution for the school I work at, designed so any second
school could start using it with zero new code.

## Problem

Schools print constantly — worksheets, notices, exams, admin paperwork —
with no visibility into how much paper is used, by whom, or why. Stock runs
out with no warning, and there's no record to analyze usage trends or hold
departments accountable.

## What this does

- Logs every print job against a class/section (teaching use) or a
  department (non-teaching use — Accounts, Front Office, Library)
- Tracks paper stock as a running ledger (IN vs used)
- Dashboard with chart-based reports: usage by class, by teacher, monthly
  trend, and breakdown by purpose
- CSV export and automated monthly email summaries to the principal
- Permission-based access control — admins decide exactly what each staff
  login can see or do

## Why multi-tenant

Rather than building this for one school, the system is designed so any
school is a tenant (`School` model, `schoolId` on every collection),
isolated from every other school's data — enforced centrally through a
scoping middleware, never left to individual routes to get right. A
platform owner can onboard a new school in one API call: no new deploy, no
code changes.

## Tech stack

- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose)
- **Frontend:** React (Vite), Recharts for reports
- **Auth:** JWT + bcrypt, permission-based access control (not fixed roles)
- **Free-tier infrastructure throughout:** MongoDB Atlas, Render/Railway,
  Vercel/Netlify

## Architecture highlights

- Tenant isolation enforced server-side via a single `scopeToSchool`
  middleware — every controller reads `schoolId` from the verified JWT,
  never from the request body or URL, so one login can never reach into
  another school's data
- Permission system (`permissions: string[]` per user) instead of fixed
  roles — an admin can grant exactly the capabilities a login needs
  (e.g. reception gets only `CREATE_PRINTLOG`)
- Built in TypeScript from the start given the planned scale and feature
  roadmap — not a retrofit

## Status

Currently in active development. Multi-tenant foundation, authentication,
and permission-based Manage Users (Phases 0–2) are complete and tested
end-to-end. See `PROGRESS.md` for build log and current phase.

## Getting started

```bash
cd server
npm install
# fill in .env — see .env.example
npm run dev
```

## License

MIT (or your preferred license)