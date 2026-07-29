# Paper Tracker — Progress Log

## Architecture
Multi-tenant SaaS (v4 LLD). School = top-level tenant, schoolId scoped on
every collection. Backend in TypeScript (server/), built to scale long-term,
not treated as throwaway portfolio work.

## Current Phase
Phase 0/1 complete — Multi-tenant foundation + Auth/permission middleware

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

## Next steps
- Phase 2: Manage Users — POST /api/users (school-admin-only), so a school
  admin can create teacher/reception logins and assign specific
  permissions (e.g. CREATE_PRINTLOG for reception).