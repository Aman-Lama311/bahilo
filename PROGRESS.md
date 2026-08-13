# Paper Tracker — Progress Log

## Architecture
Multi-tenant SaaS (v4 LLD). School = top-level tenant, schoolId scoped on
every collection. Backend in TypeScript (server/), built to scale long-term.

## Current Phase
Backend core (Phases 1-8) complete. Notebook/Copy Register module also
complete: Student, NotebookType, NotebookIssue (with update/delete),
NotebookReason, NotebookStock. Next: UI/UX mockups before any frontend code.

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
  full CRUD + bulk-create + bulk-update, gated by MANAGE_MASTER_DATA.
  Populated real data for Asia Pacific School: 13 classes, all sections,
  47 Academic teachers (from Veda Ingrails), 3 departments.
  Section-teacher assignment deferred to frontend UI phase.

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

- **Bulk-update, all master data + Student:** PUT /bulk added to Classes,
  Sections, Teachers, Departments, and Students — mirrors the existing
  bulk-create pattern. Route ordering matters: /bulk must be registered
  before /:id, or Express matches "bulk" as if it were an :id param and
  fails casting to ObjectId — hit and fixed this on Students first, then
  applied the correct order everywhere else up front.

### Notebook/Copy Register module (new, same backend)

Digitizes the handwritten register tracking which student took which
notebook type, how many, and why — plus visibility into how much stock
is actually left, which the register alone never provided.

- **N1 — Student:** schoolId, name, classId, sectionId, optional veidaId.
  Hard unique index on schoolId+classId+sectionId+name (same-named
  students fine across sections, blocked within one). Full CRUD +
  bulk-create + bulk-update. Bulk-imported a real 27-student class list
  (Class 1, Cherry section).

- **N2 — NotebookType:** dynamic catalog (e.g. A4 Long, A4 Brown Copy,
  Small Nepali/Samajik), same pattern as Department. Full CRUD + bulk.

- **N3 — NotebookIssue:** the actual log (studentId, notebookTypeId,
  quantity, reason, classId/sectionId denormalized from the student for
  fast filtering). Create, filterable list, per-student running-total
  summary (aggregation + $lookup into NotebookType). Later extended with
  update/delete for correcting mistaken entries — gated by the same
  CREATE_NOTEBOOK_ISSUE permission, since whoever can log one should be
  able to fix their own mistake.

- **NotebookReason:** dynamic catalog (Lost, Damaged, Finished, New
  Admission, etc.) to power a dropdown-plus-"Other" UX in the frontend.
  NotebookIssue.reason itself stays a free-text string — the catalog is
  additive, not a schema change.

- **NotebookStock:** mirrors PaperStock for notebooks. Since there are
  multiple notebook types (unlike paper's single running total), current
  stock is computed per type: sum(NotebookStock.quantity) −
  sum(NotebookIssue.quantity), grouped by notebookTypeId. Verified
  end-to-end — added 1200 total stock for one type, issued some to a
  student, confirmed currentStock dropped by exactly that amount.

All five pieces gated by their own permission keys (MANAGE_STUDENTS,
MANAGE_NOTEBOOK_TYPES, CREATE_/VIEW_NOTEBOOK_ISSUES,
MANAGE_NOTEBOOK_REASONS, MANAGE_NOTEBOOK_STOCK), same scoping middleware
as the rest of the backend.

## Next steps
- UI/UX design pass (mockups) before any frontend code — Login, Print
  Log, Dashboard, Master Data, NotebookIssue form (cascading Class→
  Section→Student dropdowns), and a "School Setup" bulk-onboarding
  screen (sequences class→section→teacher/student→department bulk calls
  behind one form).
- Class/section-level notebook summary report (currently only
  per-student totals exist).
- Section-to-teacher assignment UI (deferred from Phase 3).
- Possible project rename — domain bahilo.com secured (from Nepali
  "bahi" = register/notebook), decision pending.
- Consider Swagger/OpenAPI docs, and strict: 'throw' on models (currently
  Mongoose silently strips unrecognized fields instead of erroring —
  hit this once during NotebookReason testing, harmless but worth
  tightening later).