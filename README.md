# DONATEWEB

## Overview
DONATEWEB is a full-stack NGO discovery and admin-management platform.

- Frontend: React (CRA), React Router, Axios, Tailwind utilities.
- Backend: Express, Prisma ORM, PostgreSQL, JWT-based admin auth.

This repository is split into two apps:

- `frontend/` for user-facing and admin UI.
- `backend/` for API, auth, and database access.

## Project Structure
```text
DONATEWEB/
  backend/
    prisma/
    src/
      controllers/
      routes/
      services/
      middleware/
      utils/
      db/
  frontend/
    public/
    src/
      pages/
      components/
      services/
      hooks/
      utils/
```

## Read-First Onboarding Flow
Use this exact order when explaining the project to a new author.

1. `project_chapter_scope_priority_unfolding.md` (high-level intent)
2. `frontend/src/index.js` (frontend entry)
3. `frontend/src/App.js` (frontend route map)
4. `frontend/src/pages/*` (feature pages)
5. `frontend/src/services/http.js` (shared API client + token refresh)
6. `frontend/src/services/*.js` (API calls by domain)
7. `backend/src/server.js` (backend entry)
8. `backend/src/app.js` (middleware + mounted API routes)
9. `backend/src/routes/*.js` (endpoint inventory)
10. `backend/src/controllers/*.js` (request parsing + response shape)
11. `backend/src/services/*.js` (database logic)
12. `backend/prisma/schema.prisma` (data model)

## Request Flow (End-to-End)
1. User action starts in a page component (example: `frontend/src/pages/Browse.jsx`).
2. Page calls frontend service (example: `frontend/src/services/ngo.service.js`).
3. Service calls Axios client (`frontend/src/services/http.js`) with base URL and auth headers.
4. Request reaches backend route (`backend/src/routes/ngo.routes.js`).
5. Controller validates/parses and builds query (`backend/src/controllers/ngo.controller.js`).
6. Service runs Prisma query (`backend/src/services/ngo.service.js`).
7. JSON response returns to frontend and updates UI state.

## Local Setup
### 1. Backend
```bash
cd backend
npm install
```
Create `.env` in `backend/` with:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
PORT=5000
JWT_SECRET=replace_me
REFRESH_TOKEN_SECRET=replace_me
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
ADMIN_EMAIL=admin@login.com
ADMIN_PASSWORD=6767
```

Run Prisma and API:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
```
Create `.env` in `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Run UI:

```bash
npm start
```

## Reports
- Frontend report: `frontend/README.md`
- Backend report: `backend/README.md`