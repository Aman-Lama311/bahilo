# Paper Tracker — Progress Log

## Architecture
Multi-tenant SaaS (v4 LLD). School = top-level tenant, schoolId scoped on
every collection. Backend in TypeScript (server/), built to scale long-term.

## Current Phase
Backend fully complete — Phases 1-8, plus self-service change-password
and OTP-based forgot-password/reset-password. Next: React frontend.

## Log

- **Setup:** TS + tsx + nodemon scaffold working. Switched ts-node→tsx and
  bcrypt→bcryptjs (Node v24 compatibility). MongoDB Atlas connected (M0,
  Mumbai); debugged .env BOM encoding, password URL-encoding, and a DNS
  resolution issue after switching networks (fixed with dns.setServers).

- **Phase 1 — Foundation:** School + User models, JWT auth, scopeToSchool +
  permission middleware, platform-owner school onboarding. Verified
  end-to-end: platform-owner login → created real school (tenant #1) →
  school-admin login with correctly scoped JWT.

- **Phase 2 — User Management:** requireSchoolAdmin guard, permissions
  catalog, full user CRUD. Verified: admin creates staff with specific
  permissions, staff login scoped correctly, non-admin blocked (403) from
  admin actions.

- **Phase 3 — Master Data:** Class/Section/Teacher/Department models +
  CRUD + bulk-create, gated by MANAGE_MASTER_DATA. Populated real data for
  Asia Pacific School: 13 classes, all sections, 47 Academic teachers
  (from Veda Ingrails), 3 departments. Section-teacher assignment deferred
  to frontend UI phase.

- **Phase 4 — PrintLog:** create + list, gated by CREATE_PRINTLOG /
  VIEW_PRINTLOGS. Enforces "class/section OR department, never both,
  never neither." Filterable by class/department/teacher/date. Verified
  all validation paths and filtering.

- **Phase 5 — Stock Ledger:** addStock, getCurrentStock, listStockEntries,
  gated by MANAGE_STOCK. current stock = sum(reams×sheetsPerReam) −
  sum(sheetsUsed). Fixed an ObjectId-casting bug in aggregate $match
  (strings aren't auto-cast like in .find()). Verified running total
  updates correctly across multiple stock entries.

- **Phase 6 — Reports (backend):** by-class, by-teacher, monthly-trend,
  by-purpose aggregation endpoints, gated by VIEW_REPORTS. Uses $lookup
  to join Class/Teacher names into results. Verified against real
  print-log data.

- **Phase 7 — CSV Export:** hand-written CSV builder (no dependency),
  export endpoints for print logs and stock entries, gated by EXPORT_CSV.
  Verified both downloads via Thunder Client — correctly formatted with
  populated names and fallback empty fields.

- **Phase 8 — Monthly Auto-Email:** nodemailer + node-cron job (runs 1st
  of each month), loops over active schools, sends each its own summary
  to its own principalEmail. Manual /resend endpoint for on-demand
  testing, gated by MANAGE_EMAIL_SETTINGS. Verified SMTP send end-to-end
  (Gmail App Password). Along the way, hit and resolved a Node.js
  installation corruption (a corrupted npm-bundled file broke every npm
  command) via full Node reinstall.

- **Password reset (add-on, not in original phase list):** self-service
  change-password (logged-in, verifies current password first), plus
  OTP-based forgot-password/reset-password — 6-digit code emailed,
  10-minute expiry, single-use. Verified working for both school admin
  and a non-admin staff account (reception), confirming it's
  permission-agnostic.

## Next steps
- Start the React frontend (Vite): login, dashboard, Manage Users,
  master data screens, PrintLog form, Recharts reports dashboard.
- Section-to-teacher assignment UI (deferred from Phase 3).
- Consider Swagger/OpenAPI docs now that the API surface is stable.