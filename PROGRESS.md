# Paper Tracker — Progress Log

## Architecture
Multi-tenant SaaS (v4 LLD). School = top-level tenant, schoolId scoped on
every collection. Backend in TypeScript (server/), built to scale long-term.

## Current Phase
Phase 6 complete — Reports backend (chart data endpoints). Moving to
Phase 7 (CSV Export) next, then Phase 8 (Monthly Email), before starting
the frontend.

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

## Next steps
- Phase 7: CSV Export — reuse the Phase 6 report queries, format as CSV.
- Phase 8: Monthly Email — nodemailer + node-cron, loop over active
  schools, send each their own summary to principalEmail.
- Only after 7 and 8: start the React frontend (Vite), including the
  Recharts dashboard for Phase 6's data.
- Noted for later: self-service change-password + "forgot password" flow
  (once Phase 8's email infra exists).