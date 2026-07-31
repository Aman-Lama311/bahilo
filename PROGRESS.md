# Paper Tracker — Progress Log

## Architecture
Multi-tenant SaaS (v4 LLD). School = top-level tenant, schoolId scoped on
every collection. Backend in TypeScript (server/), built to scale long-term,
not treated as throwaway portfolio work.

## Current Phase
Phase 5 complete — Stock Ledger (add stock, current stock calculation,
list entries)

## Log

- Repo initialized, server/ scaffolded with TypeScript, tsx, and nodemon —
  confirmed working.
- Switched ts-node → tsx (Node v24 compatibility issue).
- Switched bcrypt → bcryptjs (native binding failed to load on Node v24).
- Wrote shared types (jwt.types.ts, express.d.ts), config/db.ts.
- Wrote School.ts and User.ts models (schoolId scoping, compound unique
  index on schoolId+email).
- Wrote middleware: auth.ts (verifyToken, requirePlatformOwner),
  scopeToSchool.ts, permission.ts (requirePermission factory).
- Wrote auth.controller.ts (login) and auth.routes.ts.
- Wrote seedPlatformOwner.ts script — creates the one platform-owner account.
- MongoDB Atlas connected (M0 free cluster, Mumbai region). Debugged: .env
  BOM encoding issue, special-character password URL-encoding, Atlas
  Database Access page location.
- Wrote platform.controller.ts (createSchool, listSchools, updateSchool)
  and platform.routes.ts, wired into server.ts.
- End-to-end verified via Postman: platform-owner login → created first
  real school (tenant #1) + its admin → logged in as that school admin →
  confirmed JWT correctly scoped (schoolId set, isSuperAdmin true,
  isPlatformOwner false).
- Pushed to GitHub, added README.md.
- Phase 0/1 fully closed out: school-admin login re-verified with correctly
  scoped JWT before moving on.
- Added requireSchoolAdmin guard to auth.ts, permissions catalog
  (constants/permissions.ts), users.controller.ts (createUser, listUsers,
  updateUserPermissions, deleteUser), users.routes.ts — wired into server.ts.
- End-to-end verified via Postman: school admin created a reception login
  with CREATE_PRINTLOG + VIEW_PRINTLOGS permissions, reception logged in
  with correctly scoped JWT, and reception was correctly blocked (403) from
  admin-only actions (POST /api/users).
- Built Class, Section, Teacher, Department models + controllers (single
  and bulk-create) + routes, gated by MANAGE_MASTER_DATA, wired into
  server.ts.
- Hit a DNS resolution issue after switching Ethernet networks (Node's
  resolver couldn't reach the network-assigned DNS server for MongoDB's
  SRV lookup) — fixed by forcing dns.setServers(['8.8.8.8', '1.1.1.1'])
  in config/db.ts.
- Populated real school data (Asia Pacific School) via bulk-create: 13
  classes (Nursery–Class 10), all their sections, 47 Academic teachers
  (name + veidaId from Veda Ingrails), and 3 departments (Accounts,
  Reception, Library). Section-to-teacher assignment deferred to the
  frontend UI phase rather than done via raw API calls.
- Built PrintLog model + controller + routes, gated by CREATE_PRINTLOG /
  VIEW_PRINTLOGS. Enforced the "class/section OR department, never both,
  never neither" rule at the controller level. listPrintLogs supports
  filtering by classId/departmentId/teacherId and date range, and
  populates related documents.
- End-to-end verified via Postman: teaching print log created (with real
  teacherId/classId/sectionId), department print log created, both-fields
  rejected with 400, neither-field rejected with 400, list returns fully
  populated logs sorted newest-first, and classId filter correctly
  narrows results.
- Built PaperStock model + controller (addStock, getCurrentStock,
  listStockEntries) + routes, gated by MANAGE_STOCK. current stock =
  sum(reams * sheetsPerReam) − sum(sheetsUsed across that school's
  PrintLogs), computed via MongoDB aggregation.
- Hit and fixed a real bug: aggregate()'s $match stage doesn't
  auto-cast a string schoolId to ObjectId (unlike .find()), so the
  first test returned all zeros — fixed by explicitly wrapping
  req.schoolId in new mongoose.Types.ObjectId(...) before matching.
- Also wrote and then deleted a one-off resetAdminPassword.ts script
  (used to recover a forgotten school-admin password during testing —
  not something to keep in the codebase long-term).
- End-to-end verified via Postman: added stock (20 reams), confirmed
  current stock reflected sheetsIn minus prior print-log usage, added a
  second stock entry, confirmed the running total updated correctly.

## Next steps
- Phase 6: Reports Dashboard — chart-based (Recharts): bar (by-class,
  by-teacher), line (monthly trend), donut (by-purpose breakdown).
  Backend aggregation endpoints first, frontend charts after.
- Noted for later (not yet planned into a phase): self-service change-
  password endpoint, and a "forgot password" flow once Phase 8's email
  infrastructure (nodemailer) exists to support it.