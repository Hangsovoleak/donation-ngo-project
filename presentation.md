# DONATEWEB Presentation (Step by Step with Real Code)

This file explains the real code in `d:\DONATEWEB` in a teacher-friendly, step-by-step way. It includes short source-code examples from your project.

---

## 1) Project Overview

**Goal:** A donation platform where users can browse NGOs and admins can manage them.

**Architecture:**

Client (React) -> API (Node/Express) -> Database (PostgreSQL via Prisma)

---

## Quick Definitions (Easy to Remember)

- `Frontend`: The part users see in the browser (React pages and components).
- `Backend`: The server that handles requests and talks to the database (Node/Express).
- `API`: The rules and URLs the frontend uses to ask the backend for data.
- `Endpoint`: One API URL such as `GET /api/ngos`.
- `REST`: A style of API using standard HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`).
- `Route`: Code that handles one endpoint in Express.
- `Middleware`: Functions that run before routes (CORS, JSON parsing).
- `Database`: Where data is stored (PostgreSQL).
- `ORM`: Tool that turns code into SQL queries (Prisma).
- `Schema`: The database blueprint of tables and relations (`schema.prisma`).
- `CRUD`: Create, Read, Update, Delete.
- `Filter`: Narrow results (city, category, verified).
- `Pagination`: Split large lists using `limit` and `offset`.
- `Normalize`: Convert raw DB data into clean JSON for UI.
- `State`: React memory for data that changes (lists, filters).
- `Component`: Reusable UI block (card, form, layout).
- `Page`: Full screen view (Home, Browse, Details, Admin).
## 2) Backend Entry Point

**File:** `d:\DONATEWEB\backend\src\server.js`

**What it does:**
- Loads environment variables
- Starts Express server
- Warms up database connection

```js
import "dotenv/config";
import app from "./app.js";
import prisma from "./db/prisma.js";

const port = process.env.PORT || 5000;

async function warmUp() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("DB warm-up OK");
  } catch (e) {
    console.log("DB warm-up failed:", e.message);
  }
}

app.listen(port, async () => {
  console.log(`API running port: http://localhost:${port}`);
  await warmUp();
});
```

---

## 3) Express App Setup

**File:** `d:\DONATEWEB\backend\src\app.js`

**What it does:**
- Adds middleware (CORS + JSON)
- Registers routes
- Adds error handlers
- Adds health check

```js
import express from 'express';
import cors from 'cors';

import ngoRoutes from './routes/ngo.routes.js';
import categoryRoutes from './routes/category.routes.js';
import beneficiariesRoutes from './routes/beneficiary.routes.js';
import locationRoutes from './routes/location.routes.js';

import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/ngos', ngoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/beneficiaries', beneficiariesRoutes);
app.use('/api/locations', locationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
```

---

## 4) Database Connection (Prisma)

**File:** `d:\DONATEWEB\backend\src\db\prisma.js`

**What it does:**
- Creates Prisma client
- Reuses client during development

```js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ["query"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

---

## 5) Database Schema (PostgreSQL)

**File:** `d:\DONATEWEB\backend\prisma\schema.prisma`

**What it models:**
- NGOs (main table)
- Categories, Beneficiaries (many-to-many)
- Locations (donation links)

```prisma
model ngos {
  id                Int                 @id @default(autoincrement())
  name              String
  description       String?
  city              String?
  phone             String?
  image_url         String?
  verified          Boolean?            @default(false)
  created_at        DateTime?           @default(now())
  updated_at        DateTime?           @default(now())
  ngo_beneficiaries ngo_beneficiaries[]
  ngo_categories    ngo_categories[]
  ngo_locations     ngo_locations[]
}
```

---

## 6) NGO API (List + Filters)

**File:** `d:\DONATEWEB\backend\src\routes\ngo.routes.js`

**Endpoint:** `GET /api/ngos`

**Features:**
- Filters: city, verified, category, search
- Pagination: limit, offset

```js
// GET /api/ngos?city=&verified=&search=&category=&limit=&offset=
router.get('/', async (req, res, next) => {
  const city = req.query.city ? String(req.query.city) : undefined;
  const search = req.query.search ? String(req.query.search) : undefined;
  const category = req.query.category ? String(req.query.category) : undefined;
  const verified = toBool(req.query.verified);

  const limitRaw = Number(req.query.limit);
  const offsetRaw = Number(req.query.offset);

  const take = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 20;
  const skip = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;

  const where = {
    ...(city && { city: { equals: city, mode: "insensitive" } }),
    ...(typeof verified === "boolean" && { verified }),
    ...(category && {
      ngo_categories: {
        some: { categories: { name: { equals: category, mode: "insensitive" } } },
      },
    }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const ngos = await prisma.ngos.findMany({
    where,
    orderBy: { id: "asc" },
    take,
    skip,
    select: {
      id: true,
      name: true,
      description: true,
      city: true,
      image_url: true,
      verified: true,
      ngo_categories: { select: { categories: { select: { name: true } } } },
    },
  });

  const payload = ngos.map((n) => ({
    id: n.id,
    name: n.name,
    description: n.description,
    city: n.city,
    image_url: n.image_url || null,
    verified: Boolean(n.verified),
    categories: n.ngo_categories.map((x) => x.categories.name),
  }));

  return res.json(payload);
});
```

---

## 7) NGO API (Detail + CRUD)

**File:** `d:\DONATEWEB\backend\src\routes\ngo.routes.js`

**Endpoints:**
- `GET /api/ngos/:id`
- `POST /api/ngos`
- `PATCH /api/ngos/:id`
- `DELETE /api/ngos/:id`

```js
// GET /api/ngos/:id
router.get('/:id', async (req, res, next) => {
  const id = parseId(req.params.id);
  if (id == null) return res.status(400).json({ message: "Invalid id" });

  const ngo = await prisma.ngos.findUnique({
    where: { id },
    select: ngoSelectWithRelations(),
  });

  if (!ngo) return res.status(404).json({ message: "NGO not found" });
  return res.json(formatNgoDetail(ngo));
});

// POST /api/ngos
router.post('/', async (req, res, next) => {
  const input = parseNgoCreate(req.body);
  if (!input.ok) return res.status(400).json({ message: input.error });

  const created = await prisma.ngos.create({
    data: input.data,
    select: ngoSelectWithRelations(),
  });

  return res.status(201).json(formatNgoDetail(created));
});
```

---

## 8) Meta Endpoints (Categories + Beneficiaries)

**Files:**
- `d:\DONATEWEB\backend\src\routes\category.routes.js`
- `d:\DONATEWEB\backend\src\routes\beneficiary.routes.js`

```js
// GET /api/categories
router.get("/", async (req, res, next) => {
  const categories = await prisma.categories.findMany({ orderBy: { id: "asc" } });
  res.json(categories);
});
```

```js
// GET /api/beneficiaries
router.get("/", async (req, res, next) => {
  const beneficiaries = await prisma.beneficiaries.findMany({
    orderBy: { id : "asc"},
  });

  res.json(beneficiaries);
});
```

---

## 9) React Router Structure

**File:** `d:\DONATEWEB\frontend\src\App.js`

**Routes:**
- `/` Home
- `/browse` Browse
- `/ngos/:id` Details
- `/admin/login` Admin Login
- `/admin` Admin Dashboard

```js
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<Home />}/>
  <Route path="/browse" element={<Browse />}/>
  <Route path="/ngos/:id" element={<Detail />}/>
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin" element={<Admin />}/>
</Routes>
```

---

## 10) API Layer in React (Axios)

**Files:**
- `d:\DONATEWEB\frontend\src\api\http.js`
- `d:\DONATEWEB\frontend\src\api\ngoApi.js`

```js
// http.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export default api;
```

```js
// ngoApi.js
export const getNgos = (params) => api.get("/ngos", { params });
export const getNgoById = (id) => api.get(`/ngos/${id}`);
export const createNgo = (payload) => api.post("/ngos", payload);
export const updateNgo = (id, payload) => api.patch(`/ngos/${id}`, payload);
export const deleteNgo = (id) => api.delete(`/ngos/${id}`);
export const toggleVerifyNgo = (id) => api.patch(`/ngos/${id}/verify`);
```

---

## 11) Browse Page Filters (Real UI)

**File:** `d:\DONATEWEB\frontend\src\pages\Browse.jsx`

**What happens:**
- Reads filters from URL
- Sends filters to API
- Renders list of NGOs

```js
const [search, setSearch] = useState(params.get("search") || "");
const [city, setCity] = useState(params.get("city") || "");
const [category, setCategory] = useState(params.get("category") || "");
const [verifiedOnly, setVerifiedOnly] = useState(params.get("verified") === "true");

const list = await getNgos({
  search,
  city,
  category,
  verified: verifiedOnly ? "true" : "",
});
```

---

## 12) Details Page (NGO Detail View)

**File:** `d:\DONATEWEB\frontend\src\pages\Details.jsx`

**What happens:**
- Fetches NGO by `id`
- Displays categories, beneficiaries, donation info
- Shows map link if available

```js
const { id } = useParams();

useEffect(() => {
  async function load() {
    const data = await getNgoById(id);
    setNgo(data.data || data);
  }
  load();
}, [id]);
```

---

## 13) Admin Login (Demo Auth)

**File:** `d:\DONATEWEB\frontend\src\pages\AdminLogin.jsx`

**Demo credentials:**
- Email: `admin@login.com`
- Password: `6767`

```js
if(email === 'admin@login.com' && password === "6767") {
  localStorage.setItem("AdminToken", "demo-token");
  navigate("/admin");
} else {
  setErr("Invalid email or password.");
}
```

---

## 14) Admin CRUD (Add, Edit, Delete, Verify)

**File:** `d:\DONATEWEB\frontend\src\pages\Admin.jsx`

**What happens:**
- Loads list of NGOs
- Opens modal to create/edit
- Calls API for CRUD

```js
const list = await getNgos();
setNgos(asData(list));

await createNgo(payload);
await updateNgo(editingNgo.id, payload);
await deleteNgo(ngo.id);
await toggleVerifyNgo(ngo.id);
```

---

## 15) Step-by-Step Data Flow (Real App)

1. User opens Home or Browse page.
2. React triggers Axios call in `frontend/src/api/*`.
3. Express route in `backend/src/routes` receives request.
4. Prisma runs SQL queries using `schema.prisma`.
5. API normalizes response JSON.
6. React renders cards, details, admin table.

---

## 16) Quick Testing Checklist

- Backend health check: `GET /api/health` -> `{ ok: true }`
- Browse page loads NGOs
- Filters return correct results
- Details page opens for one NGO
- Admin login works
- CRUD updates appear in list

---

## 17) Summary (Teacher-Friendly)

- Backend: Node/Express REST API with Prisma + PostgreSQL.
- Frontend: React SPA with routing, filters, admin dashboard.
- Data flow: UI -> API -> DB -> clean JSON -> UI.
- Clear separation of concerns makes code easy to test and maintain.

---

End of presentation.

