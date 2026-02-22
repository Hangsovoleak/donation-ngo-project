# Backend README

## Purpose
The backend exposes REST APIs for NGO discovery and admin operations, backed by PostgreSQL via Prisma.

## Tech Stack
- Node.js + Express (ESM)
- Prisma ORM
- PostgreSQL
- JWT (`jsonwebtoken`) for admin auth

## Directory Guide
```text
src/
  server.js               # Process entrypoint
  app.js                  # Express app wiring
  routes/                 # API route definitions
  controllers/            # Request/response logic
  services/               # Prisma/data operations
  middleware/             # Auth + error middleware
  utils/                  # Parsers/token helpers
  db/prisma.js            # Prisma client
prisma/
  schema.prisma           # Data model
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
1. Route receives request.
2. Controller parses/validates query/body/path.
3. Controller calls service.
4. Service executes Prisma query.
5. Controller returns normalized JSON.
6. Errors pass through `notFound` and `errorHandler` middleware.

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