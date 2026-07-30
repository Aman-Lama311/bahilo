# A4 Paper Usage Tracker

A multi-tenant SaaS application for tracking A4 paper usage across schools. Built as a real production-focused solution for the school I work at, but architected so any school can be onboarded without code changes or redeployment.

---

## Problem

Schools print thousands of pages every month—worksheets, notices, examinations, administrative documents, and reports—but most have no reliable way to answer questions like:

* Which department uses the most paper?
* Which classes generate the highest printing volume?
* How much paper was consumed this month?
* How quickly is paper stock being depleted?

Without proper tracking, stock shortages occur unexpectedly, usage trends remain invisible, and accountability is difficult.

---

## Features

### Multi-Tenant Architecture

* One platform supports unlimited schools
* Every school is isolated through `schoolId` scoping
* Platform Owner can onboard a new school in a single API call
* No code changes or separate deployments required for new schools

### Authentication & Authorization

* JWT authentication
* Platform Owner and School Admin accounts
* Permission-based access control (not fixed roles)
* Fine-grained permissions for every staff account

Example:

* Reception → `CREATE_PRINTLOG`, `VIEW_PRINTLOGS`
* School Admin → full management permissions

### User Management

School administrators can:

* Create staff accounts
* View users
* Update permissions
* Delete users

### Master Data Management

School administrators can manage:

* Classes
* Sections
* Teachers
* Departments

Supports both single-record creation and bulk import for initial school setup.

### Print Tracking

Every print job is logged against either:

* **Teaching**

  * Class
  * Section
  * Teacher

OR

* **Non-Teaching**

  * Department

A print log belongs to **either** teaching **or** non-teaching usage, never both, and never neither—enforced at the API level.

Supports filtering by class, department, teacher, and date range.

### Planned Features

* Paper stock ledger (Stock IN / Usage OUT) *(Next Phase)*
* Dashboard & analytics
* Monthly usage trends
* Teacher-wise reports
* Class-wise reports
* Department-wise reports
* CSV export
* Monthly email summaries
* Low-stock alerts

---

# Why Multi-Tenant?

Instead of building software for only one school, this project was designed as a SaaS platform from day one.

Every collection contains a `schoolId`, and tenant isolation is enforced centrally through middleware. Controllers never trust a `schoolId` supplied by the client—they always read it from the verified JWT—preventing one school from accessing another school's data.

---

# Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB Atlas
* Mongoose

### Authentication

* JWT
* bcryptjs
* Permission-based authorization

### Frontend *(Upcoming)*

* React
* Vite
* Recharts

### Infrastructure

* MongoDB Atlas
* Render or Railway
* Vercel or Netlify

---

# Architecture Highlights

* Multi-tenant SaaS architecture
* Centralized tenant isolation middleware
* JWT-based authentication
* Permission-based authorization
* TypeScript from the beginning
* Compound unique indexes for tenant-safe uniqueness
* Scalable folder structure suitable for production growth

---

# Current Progress

## ✅ Phase 1 – Foundation

* TypeScript backend setup
* MongoDB Atlas integration
* JWT authentication
* Platform Owner seeding
* School onboarding
* School Admin authentication

## ✅ Phase 2 – User Management

* Create users
* List users
* Update permissions
* Delete users
* Permission middleware
* End-to-end Postman testing

## ✅ Phase 3 – Master Data

Implemented CRUD APIs for:

* Classes
* Sections
* Teachers
* Departments

Successfully populated production-like data for **Asia Pacific School**, including:

* 13 Classes
* All Sections
* 47 Academic Teachers
* 3 Departments

## ✅ Phase 4 – Print Log Module

Implemented:

* Create Print Log
* View Print Logs (with filtering by class, department, teacher, and date range)
* Permission checks (`CREATE_PRINTLOG`, `VIEW_PRINTLOGS`)
* Teaching vs Non-Teaching validation—rejects logs with both or neither

End-to-end verified via Postman: teaching prints, department prints, both-fields and neither-field rejection, filtered listing.

---

## 🚧 Current Phase

**Phase 5 – Stock Ledger**

# Project Structure

```text
server/
├── config/
├── constants/
├── controllers/
├── middleware/
├── models/
├── routes/
├── scripts/
├── types/
├── utils/
└── server.ts
```

---

# Getting Started

```bash
git clone <repository-url>

cd server

npm install

# Configure .env using .env.example

npm run dev
```

---

# Current Status

The backend foundation is complete and fully functional.

Implemented features include:

* Multi-tenant architecture
* Authentication
* Authorization
* School onboarding
* User management
* Master data management
* Print log tracking

The project is now moving into stock ledger tracking, which will power low-stock alerts and feed directly into the upcoming reporting and analytics dashboard.