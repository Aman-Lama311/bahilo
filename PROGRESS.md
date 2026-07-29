# Paper Tracker — Progress Log

## Architecture
Multi-tenant SaaS (v4 LLD). School = top-level tenant, schoolId scoped on
every collection. Backend in TypeScript (server/), built to scale long-term,
not treated as throwaway portfolio work.

## Current Phase
Phase 2 complete — Manage Users (school-admin creates staff logins with
granular permissions)

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

## Next steps
- Phase 3: Classes / Sections / Teachers / Departments CRUD, gated by
  MANAGE_MASTER_DATA, scoped by existing scopeToSchool middleware.