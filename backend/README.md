# Backend README

## Purpose
The backend exposes REST APIs for NGO discovery and admin operations, backed by PostgreSQL via Prisma.

## Tech Stack
- Node.js + Express (ESM)
- Prisma ORM
- PostgreSQL
- JWT (`jsonwebtoken`) for admin auth

## Data Model
```mermaid
erDiagram
    NGOS ||--o{ NGO_CATEGORIES : has
    CATEGORIES ||--o{ NGO_CATEGORIES : categorized_by
    NGOS ||--o{ NGO_BENEFICIARIES : supports
    BENEFICIARIES ||--o{ NGO_BENEFICIARIES : benefit_from
    NGOS ||--o{ NGO_LOCATIONS : located_at

    NGOS {
        int id PK
        string name
        string description
        string city
        boolean verified
    }
    CATEGORIES {
        int id PK
        string name
    }
    BENEFICIARIES {
        int id PK
        string name
    }
```

## Directory Guide
```text
src/
├── server.js               # Entry point: Starts the HTTP server and handles shutdowns
├── app.js                  # Express setup: Configures middleware, routes, and global handlers
├── controllers/            # Request handlers: Logic for parsing params and sending responses
│   ├── admin.controller.js      # Admin authentication and refresh logic
│   ├── ngo.controller.js        # NGO CRUD operations and verification logic
│   ├── category.controller.js   # Category fetching
│   ├── beneficiary.controller.js # Beneficiary fetching
│   └── location.controller.js    # Location fetching (specific to NGOs)
├── routes/                 # API endpoint definitions
│   ├── admin.routes.js          # /api/admin paths (login, refresh, logout)
│   ├── ngo.routes.js            # /api/ngos paths (public + protected)
│   ├── category.routes.js       # /api/categories paths
│   ├── beneficiary.routes.js    # /api/beneficiaries paths
│   └── location.routes.js       # /api/locations paths
├── services/               # Business logic: Direct interaction with Prisma client
│   ├── admin.service.js         # Admin credential verification
│   ├── ngo.service.js           # NGO filtering, sorting, and database updates
│   ├── category.service.js      # Category data retrieval
│   ├── beneficiary.service.js   # Beneficiary data retrieval
│   └── location.service.js      # Location data retrieval
├── middleware/             # Request lifecycle hooks
│   ├── auth.js                  # JWT validation (protects admin routes)
│   ├── errorHandler.js          # Centralized error formatting (JSON responses)
│   └── notFound.js              # Catch-all for undefined routes (404)
├── utils/                  # Shared helper functions
│   ├── ngo.utils.js             # NGO-specific parsers/formatters
│   ├── tokens.js                # JWT generation and rotation logic
│   └── validators.js            # Input validation helpers
└── db/
    └── prisma.js           # Singleton Prisma Client instance
prisma/
└── schema.prisma           # Database schema and data models
```

## Author Onboarding (Backend)
Read in this order:

1. `src/server.js`
2. `src/app.js`
3. `src/routes/ngo.routes.js`
4. `src/routes/admin.routes.js`
5. `src/routes/category.routes.js`
6. `src/routes/beneficiary.routes.js`
7. `src/routes/location.routes.js`
8. `src/controllers/ngo.controller.js`
9. `src/controllers/admin.controller.js`
10. `src/services/ngo.service.js`
11. `src/services/admin.service.js`
12. `src/middleware/auth.js`
13. `src/middleware/notFound.js`
14. `src/middleware/errorHandler.js`
15. `prisma/schema.prisma`

## API Flow
1. **Request & Global Middleware**: Client sends a request; `cors()` handles permissions and `express.json()` parses the body.
2. **Routing & Authentication**: Express matches the URL to a route; `requireAuth` middleware validates tokens for protected paths.
3. **Controller Parsing**: The Controller extracts data from `req.params/query/body` and uses `utils/` for initial validation.
4. **Service Logic & Prisma**: The Controller invokes a Service method, which executes business logic and **Prisma** database queries.
5. **Submission & Response**: The Service returns data; the Controller sends a normalized JSON response back to the client.
6. **Global Error Handling**: Unmatched routes trigger `notFound`; any logical errors are caught and formatted by the `errorHandler` middleware.

## Error Handling Specification
All errors follow this JSON structure:
```json
{
  "message": "Human readable error",
  "error": "ErrorType (optional)",
  "stack": "Stack trace (development only)"
}
```
Common codes: `400` (Bad Request), `401` (Unauthorized), `404` (Not Found), `500` (Server Error).

## Authentication Flow
1. `POST /api/admin/login` validates env-configured credentials.
2. Server returns `token` (access) and `refreshToken`.
3. Frontend sends `Authorization: Bearer <token>` for protected endpoints.
4. On expiry, frontend calls `POST /api/admin/refresh`.

## Environment Variables
Create `.env` in `backend/`:

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

## Run Backend
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Prisma Commands Reference
*   `npx prisma db push`: Sync schema to DB (retains data).
*   `npx prisma generate`: Update the Prisma Client in `node_modules`.
*   `npx prisma studio`: Open GUI to view/edit data.

## Endpoints
### Health
- `GET /api/health`

### Public
- `GET /api/ngos`
- `GET /api/ngos/:id`
- `GET /api/categories`
- `GET /api/beneficiaries`
- `GET /api/locations?ngoId=1`

### Admin Auth
- `POST /api/admin/login`
- `POST /api/admin/refresh`
- `POST /api/admin/logout`

### Protected NGO Management
- `POST /api/ngos`
- `PATCH /api/ngos/:id`
- `PATCH /api/ngos/:id/verify`
- `DELETE /api/ngos/:id`

## Backend Report
### Strengths
- Clean layering (routes/controllers/services).
- Practical filtering, sorting, and pagination in NGO listing.
- Simple and understandable JWT auth flow.

### Risks and Gaps
- Minimal input schema validation beyond helper parsing.
- No explicit test suite captured in scripts.
- Credentials stored as static env values (good for demo, weak for production IAM).

### Recommended Next Steps
1. Add request validation middleware (Zod/Joi).
2. Add automated tests for controllers and service logic.
3. Add structured logging and request IDs.
4. Add OpenAPI spec for contract clarity.