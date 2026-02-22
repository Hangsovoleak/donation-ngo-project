# Frontend README

## Purpose
The frontend provides:

- Public NGO discovery (home, browse, details).
- Admin login and dashboard for NGO CRUD + verification.

## Tech Stack
- React 19 + `react-scripts`
- React Router
- Axios
- Tailwind utility classes
- Lucide icons

## Directory Guide
```text
src/
  index.js                # App entry + BrowserRouter
  App.js                  # Route definitions
  pages/                  # Screen-level components
  components/             # Reusable UI components
  services/               # API calls
  hooks/                  # Auth/navigation hooks
  utils/                  # Token storage helpers
```

## Author Onboarding (Frontend)
Read in this order:

1. `src/index.js`
2. `src/App.js`
3. `src/components/Layout.jsx`
4. `src/pages/Home.jsx`
5. `src/pages/Browse.jsx`
6. `src/pages/Details.jsx`
7. `src/pages/AdminLogin.jsx`
8. `src/pages/Admin.jsx`
9. `src/services/http.js`
10. `src/services/ngo.service.js`
11. `src/services/meta.service.js`
12. `src/services/admin.service.js`
13. `src/hooks/useRequireAdmin.js`
14. `src/utils/authStorage.js`

## Frontend Flow
1. Router maps URL to a page (`App.js`).
2. Page holds UI state and triggers API calls.
3. Service layer isolates HTTP details from UI.
4. `http.js` adds Authorization token automatically.
5. On `401`, interceptor attempts `/admin/refresh` and retries request.
6. UI renders data, loading state, or error state.

## Key Pages
- `Home.jsx`: landing and feature sections.
- `Browse.jsx`: filtering, sorting, pagination, query-string sync.
- `Details.jsx`: single NGO detail view.
- `AdminLogin.jsx`: token acquisition and storage.
- `Admin.jsx`: admin dashboard for create/update/delete/verify.

## API Surface Used by Frontend
- `GET /api/ngos`
- `GET /api/ngos/:id`
- `POST /api/ngos` (auth)
- `PATCH /api/ngos/:id` (auth)
- `PATCH /api/ngos/:id/verify` (auth)
- `DELETE /api/ngos/:id` (auth)
- `GET /api/categories`
- `GET /api/beneficiaries`
- `GET /api/locations`
- `POST /api/admin/login`
- `POST /api/admin/refresh`
- `POST /api/admin/logout`

## Run Frontend
```bash
npm install
npm start
```

Set API base URL in `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Frontend Report
### Strengths
- Clear page/service separation.
- Shared HTTP client with centralized auth handling.
- Good browse UX (filters + URL sync + pagination).

### Risks and Gaps
- Limited automated tests for business flows.
- Error handling is mostly local; no global notification strategy.
- Styling patterns are mostly utility-first without shared design tokens.

### Recommended Next Steps
1. Add integration tests for Browse and Admin flows.
2. Add centralized error/toast handling.
3. Introduce feature-level docs per major page group.
4. Standardize API response typing/contracts.