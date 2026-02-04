# NGO Discovery – Full Stack Project

A full-stack NGO discovery and donation directory. The frontend helps users browse and search verified NGOs, and the backend exposes a REST API backed by PostgreSQL + Prisma. An admin dashboard allows CRUD and verification of NGO profiles.

## At a Glance

- **Frontend**: React (CRA) + React Router + Tailwind CSS + Axios
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: PostgreSQL
- **Key flows**: Browse NGOs, view details, admin CRUD + verify

## Project Structure

- `backend/`
- `backend/src/app.js`: Express app setup (middleware + routes)
- `backend/src/server.js`: server entry + DB warm-up
- `backend/src/routes/`: REST endpoints for NGOs, categories, beneficiaries, locations
- `backend/src/db/prisma.js`: Prisma client singleton
- `backend/src/middleware/`: 404 and error handler
- `backend/prisma/schema.prisma`: data model
- `frontend/`
- `frontend/src/App.js`: route definitions
- `frontend/src/api/`: Axios instance + API wrappers
- `frontend/src/pages/`: Home, Browse, Details, Admin, AdminLogin
- `frontend/src/components/`: shared UI
- `frontend/tailwind.config.js`: brand theme

## Why This Stack

### Backend

- **Express**: small, predictable HTTP layer, easy to reason about REST APIs.
- **Prisma**: type-safe DB access and clean relations; avoids SQL boilerplate.
- **PostgreSQL**: reliable relational DB with good support for joins and indexing.

### Frontend

- **React**: component model fits well for pages + shared UI.
- **React Router**: client-side navigation with meaningful URLs.
- **Tailwind CSS**: fast iteration and consistent design tokens.
- **Axios**: centralized HTTP config and easy request/response handling.

## Data Model (Backend)

Defined in `backend/prisma/schema.prisma`:

- `ngos`: main entity (name, description, city, phone, verified, etc.)
- `categories`: category list
- `beneficiaries`: beneficiary list
- `ngo_categories`: many-to-many between NGOs and categories
- `ngo_beneficiaries`: many-to-many between NGOs and beneficiaries
- `ngo_locations`: donation / map links for an NGO

This normalized design keeps data consistent and supports filtering/search.

## API Endpoints (Backend)

All endpoints are prefixed with `/api`.

- `GET /api/health`: health check
- `GET /api/ngos`: list NGOs (supports filters)
- `GET /api/ngos/:id`: NGO details
- `POST /api/ngos`: create NGO
- `PATCH /api/ngos/:id`: update NGO
- `PATCH /api/ngos/:id/verify`: toggle or set verification
- `DELETE /api/ngos/:id`: delete NGO
- `GET /api/categories`: list categories
- `GET /api/beneficiaries`: list beneficiaries
- `GET /api/locations?ngoId=1`: locations for an NGO

### NGO List Filters

`GET /api/ngos?city=&verified=&search=&category=&include=&limit=&offset=`

- `city`: case-insensitive exact match
- `verified`: `true` / `false`
- `search`: partial match on name/description/city
- `category`: match category name
- `include=details`: also return beneficiaries
- `limit` / `offset`: pagination

## How It Works (Step by Step)

### User Browse Flow

1. User opens `/` or `/browse`.
2. Frontend calls the API via Axios (`frontend/src/api/http.js`).
3. Backend reads query params and builds Prisma `where` filters.
4. Prisma queries PostgreSQL and returns data.
5. Backend normalizes the payload (e.g., `short_description`, `categories`).
6. Frontend renders cards and details pages.

### NGO Details Flow

1. User clicks a card.
2. Frontend navigates to `/ngos/:id`.
3. `GET /api/ngos/:id` returns full NGO details + locations.
4. Details page shows donation info and map links.

### Admin Flow

1. Admin signs in at `/admin/login`.
2. A demo token is stored in `localStorage` (no real auth backend).
3. Admin dashboard loads NGOs + categories + beneficiaries.
4. CRUD actions call the API endpoints and refresh the list.
5. Verify button toggles `verified` with `/api/ngos/:id/verify`.

## Environment Variables

### Backend (`backend/.env`)

- `PORT=5000`
- `DATABASE_URL=postgresql://postgres:1234@localhost:5432/donationDB`

### Frontend (`frontend/src/.env`)

- `REACT_APP_API_URL=http://localhost:5000/api`

## Local Setup

### 1) Database

1. Install PostgreSQL and create the database `donationDB`.
2. Update `backend/.env` if needed.
3. Create tables from schema:

```bash
cd backend
npx prisma db push
```

### 2) Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`.

### 3) Frontend

```bash
cd frontend
npm install
npm start
```

App runs on `http://localhost:3000`.

## Why The Code Is Structured This Way

- **Separation of concerns**: routes handle HTTP, Prisma handles DB, UI components are reusable.
- **Single Axios instance**: consistent base URL and headers.
- **Normalized API response**: frontend gets predictable fields (`short_description`, `categories`, `beneficiaries`).
- **Defensive defaults**: fallback images, empty arrays, and safe rendering to prevent UI crashes.
- **Simple admin auth**: lightweight demo flow that can be upgraded later.

## Step-by-Step Checks (Make Sure Everything Works)

1. **Database connectivity**
- Run backend and confirm “DB warm-up OK”.
- If failed, re-check `DATABASE_URL`.

2. **Health check**
- Open `http://localhost:5000/api/health` and confirm `{ "ok": true }`.

3. **Basic list**
- Open `http://localhost:5000/api/ngos` and confirm JSON list returns.

4. **Frontend API wiring**
- Open `http://localhost:3000`.
- Browse page should load NGOs.

5. **Details page**
- Click a card and ensure details render (no red error). 

6. **Admin login**
- Use demo account: `admin@login.com` / `6767`.
- Confirm dashboard loads and CRUD actions work.

7. **Verify toggle**
- Toggle verification and confirm it updates immediately.

8. **Create/Update**
- Add a new NGO, confirm it appears in browse list.

## Common Issues

- **CORS errors**: make sure backend is running and `REACT_APP_API_URL` points to `http://localhost:5000/api`.
- **Empty lists**: your DB has no seed data; create a few NGOs from Admin.
- **Prisma errors**: run `npx prisma db push` after schema changes.

## Security Note

Admin auth is a demo-only localStorage check. For production, replace this with real authentication and authorization.

## Future Improvements (Optional)

- Real admin auth (JWT + role-based access)
- Seed scripts for demo data
- Search indexing and pagination UI
- Image upload instead of URL input


    ## 1. Section Title 
    Slide: “Backend (Node.js) + Frontend (React)”

    What I’ll cover: architecture, API, data flow, UI, testing
    ## 2. Architecture
    Slide: “System Architecture”

    React client → Axios → Node/Express API → Prisma → PostgreSQL
    Clean separation between UI, API, DB
    Why this design: maintainability + scalability
    ## 3. Tech Stack Justification
    Slide: “Why These Tools”

    Node.js + Express: fast dev, REST simplicity
    Prisma: safer DB access + relations
    PostgreSQL: relational data fits NGO + categories
    React + Router: single-page UX + routing
    Tailwind: fast styling, consistency
    ## 4. Backend Structure
    Slide: “Backend Structure”

    app.js: middleware + routes
    server.js: server + DB warm-up
    routes/: NGOs, categories, beneficiaries
    schema.prisma: data model
    ## 5. Data Model
    Slide: “Database Design”

    NGO main table
    Many‑to‑many: categories + beneficiaries
    Locations for donation links
    Why: normalized, clean filters, avoids duplication
    ## 6. Core API Endpoints
    Slide: “API Endpoints”

    GET /api/ngos (filters)
    GET /api/ngos/:id
    POST /api/ngos
    PATCH /api/ngos/:id
    DELETE /api/ngos/:id
    Categories + beneficiaries endpoints
    ## 7. Filtering & Search
    Slide: “Smart Search & Filters”

    Filters by city, verified, category
    search = name/description/city
    Pagination: limit, offset
    ## 8. Backend Flow
    Slide: “Backend Request Flow”

    Request → middleware → route
    Build Prisma where
    Query DB → normalize response
    Send consistent JSON
    ## 9. Frontend Structure
    Slide: “Frontend Structure”

    Pages: Home, Browse, Details, Admin
    Components: Card, Form, Layout
    API layer: src/api/*
    ## 10. UI Flow
    Slide: “User Journey”

    Home → Browse → Details
    User finds verified NGOs
    Details show donation info
    ## 11. Admin Flow
    Slide: “Admin Dashboard”

    Login (demo token)
    Create/Edit/Delete NGO
    Verify/unverify NGOs
    Why: keeps data trusted
    ## 12. Step‑by‑Step Checks
    Slide: “Quality Checks”

    DB connection warm‑up
    /api/health success
    API endpoints return correct data
    Frontend loads data correctly
    Admin CRUD works
    ## 13. Common Issues + Fixes
    Slide: “Debugging & Risks”

    CORS issues → check API URL
    Empty list → seed data
    Prisma errors → db push
    ## 14. Wrap Up
    Slide: “Summary”

    Node backend provides clean REST API
    React frontend gives fast, clear UX
    Admin flow ensures trust
    Future improvements (auth, file upload)