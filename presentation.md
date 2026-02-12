# DONATEWEB Presentation (Updated for New Structure)

This file explains the real code in `d:\DONATEWEB` in a teacher-friendly, step-by-step way. It includes short source-code examples from your project and reflects the latest route/module structure (Feb 4, 2026).

---

## 1) Project Overview

**Goal:** A donation platform where users can browse NGOs and admins can manage them.

**Architecture:**

Client (React) -> API (Node/Express) -> Database (PostgreSQL via Prisma)

---

## 2) Updated Project Structure (Core Only)

```
D:\DONATEWEB
├─ presentation.md
├─ README.md
├─ backend
│  ├─ prisma\schema.prisma
│  ├─ src
│  │  ├─ server.js
│  │  ├─ app.js
│  │  ├─ db\prisma.js
│  │  ├─ middleware\notFound.js
│  │  ├─ middleware\errorHandler.js
│  │  └─ routes
│  │     ├─ ngo.routes.js
│  │     ├─ category.routes.js
│  │     ├─ beneficiary.routes.js
│  │     ├─ location.routes.js
│  │     └─ ngos
│  │        ├─ ngos.get.js
│  │        ├─ ngos.post.js
│  │        ├─ ngos.patch.js
│  │        ├─ ngos.delete.js
│  │        └─ ngos.helpers.js
└─ frontend
   └─ src
      ├─ App.js
      ├─ api\http.js
      ├─ api\ngoApi.js
      ├─ api\metaApi.js
      ├─ pages\Home.jsx
      ├─ pages\Browse.jsx
      ├─ pages\Details.jsx
      ├─ pages\AdminLogin.jsx
      └─ pages\Admin.jsx
```

---

## 3) Backend Entry Point

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
    console.log("DB OK! yeahhhhhh jork jey");
  } catch (e) {
    console.log("DB failed tt hx:", e.message);
  }
}

app.listen(port, async () => {
  console.log(`API running port: http://localhost:${port}`);
  await warmUp();
});
```

---

## 4) Express App Setup

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
  res.json({ok: true});
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

## 5) Database Schema (PostgreSQL + Prisma)

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
  created_at        DateTime?           @default(now()) @db.Timestamp(6)
  updated_at        DateTime?           @default(now()) @db.Timestamp(6)
  ngo_beneficiaries ngo_beneficiaries[]
  ngo_categories    ngo_categories[]
  ngo_locations     ngo_locations[]
}
```

---

## 6) NGO Routes (New Modular Structure)

**File:** `d:\DONATEWEB\backend\src\routes\ngo.routes.js`

**What it does:**
- Collects all NGO CRUD routes
- Splits logic into modular files

```js
import { Router } from "express";
import { registerNgoDeleteRoutes } from "./ngos/ngos.delete.js";
import { registerNgoGetRoutes } from "./ngos/ngos.get.js";
import { registerNgoPatchRoutes } from "./ngos/ngos.patch.js";
import { registerNgoPostRoutes } from "./ngos/ngos.post.js";

const router = Router();

registerNgoGetRoutes(router);
registerNgoPostRoutes(router);
registerNgoPatchRoutes(router);
registerNgoDeleteRoutes(router);

export default router;
```

---

## 7) NGO API (List + Filters + Optional Details)

**File:** `d:\DONATEWEB\backend\src\routes\ngos\ngos.get.js`

**Endpoint:** `GET /api/ngos`

**Features:**
- Filters: city, verified, category, search
- Optional details: `?include=details`
- Returns categories (and beneficiaries if include=details)

```js
// GET /api/ngos?city=&verified=&search=&category=&include=
router.get("/", async (req, res, next) => {
  const city = req.query.city ? String(req.query.city) : undefined;
  const search = req.query.search ? String(req.query.search) : undefined;
  const category = req.query.category ? String(req.query.category) : undefined;
  const verified = toBool(req.query.verified);

  const includeDetails = req.query.include === "details";

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
    select: {
      id: true,
      name: true,
      description: true,
      city: true,
      image_url: true,
      verified: true,
      created_at: true,
      updated_at: true,
      ngo_categories: { select: { categories: { select: { name: true } } } },
      ...(includeDetails && {
        ngo_beneficiaries: { select: { beneficiaries: { select: { name: true } } } },
      }),
    },
  });

  const payload = ngos.map((n) => ({
    id: n.id,
    name: n.name,
    description: n.description,
    city: n.city,
    image_url: n.image_url || null,
    verified: Boolean(n.verified),
    created_at: n.created_at,
    updated_at: n.updated_at,
    categories: n.ngo_categories.map((x) => x.categories.name),
    beneficiaries: includeDetails
      ? n.ngo_beneficiaries.map((x) => x.beneficiaries.name)
      : [],
  }));

  return res.json(payload);
});
```

---

## 8) NGO API (Detail)

**File:** `d:\DONATEWEB\backend\src\routes\ngos\ngos.get.js`

**Endpoint:** `GET /api/ngos/:id`

```js
router.get("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (id == null) return res.status(400).json({ message: "Invalid id" });

  const ngo = await prisma.ngos.findUnique({
    where: { id },
    select: ngoSelectWithRelations(),
  });

  if (!ngo) return res.status(404).json({ message: "NGO not found" });
  return res.json(formatNgoDetail(ngo));
});
```

---

## 9) NGO API (Create)

**File:** `d:\DONATEWEB\backend\src\routes\ngos\ngos.post.js`

**Endpoint:** `POST /api/ngos`

```js
router.post("/", async (req, res, next) => {
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

## 10) NGO API (Update + Verify Toggle)

**File:** `d:\DONATEWEB\backend\src\routes\ngos\ngos.patch.js`

**Endpoints:**
- `PATCH /api/ngos/:id`
- `PATCH /api/ngos/:id/verify`

```js
router.patch("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (id == null) return res.status(400).json({ message: "Invalid id" });

  const data = buildNgoUpdate(req.body);
  const updated = await prisma.ngos.update({
    where: { id },
    data,
    select: ngoSelectWithRelations(),
  });

  return res.json(formatNgoDetail(updated));
});

router.patch("/:id/verify", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (id == null) return res.status(400).json({ message: "Invalid id" });

  const nextValue = await resolveVerifyToggle(id, req.body?.verified);
  const updated = await prisma.ngos.update({
    where: { id },
    data: { verified: nextValue },
    select: { id: true, verified: true },
  });

  return res.json(updated);
});
```

---

## 11) NGO API (Delete)

**File:** `d:\DONATEWEB\backend\src\routes\ngos\ngos.delete.js`

**Endpoint:** `DELETE /api/ngos/:id`

```js
router.delete("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (id == null) return res.status(400).json({ message: "invalid id" });

  await prisma.ngos.delete({ where: { id } });
  return res.json({ message: "NGO deleted" });
});
```

---

## 12) NGO Helpers (Data Mapping & Validation)

**File:** `d:\DONATEWEB\backend\src\routes\ngos\ngos.helpers.js`

**What it does:**
- Parses ids and booleans
- Builds create/update payloads
- Normalizes NGO detail format
- Toggles verification

```js
export function parseNgoCreate(body) {
  const {
    name,
    description,
    city,
    phone,
    image_url,
    verified = false,
    categoryIds = [],
    beneficiaryIds = [],
    locations = [],
  } = body;

  if (!name || typeof name !== "string") {
    return { ok: false, error: "name is required" };
  }

  return {
    ok: true,
    data: {
      name,
      description,
      city,
      phone,
      image_url,
      verified: Boolean(verified),
      ngo_categories: buildCategoryLinks(categoryIds),
      ngo_beneficiaries: buildBeneficiaryLinks(beneficiaryIds),
      ngo_locations: buildLocationLinks(locations),
    },
  };
}
```

---

## 13) Meta Endpoints (Categories + Beneficiaries)

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
    orderBy: { id: "asc" },
  });
  res.json(beneficiaries);
});
```

---

## 14) Locations Endpoint (By NGO)

**File:** `d:\DONATEWEB\backend\src\routes\location.routes.js`

**Endpoint:** `GET /api/locations?ngoId=1`

```js
  router.get("/", async (req, res, next) => {
    const ngoId = parseId(req.query.ngoId);
    const where = ngoId == null ? {} : { ngo_id : ngoId };

    const locations = await prisma.ngo_locations.findMany({
      where,
      orderBy: { id: "asc" },
    });

    res.json(locations);
  });
```

---

## 15) React Router Structure

**File:** `d:\DONATEWEB\frontend\src\App.js`

**Routes:**
- `/` Home
- `/browse` Browse
- `/ngos/:id` Details
- `/admin/login` Admin Login
- `/admin` Admin Dashboard

```js
<Routes>
  <Route path="/" element={<Home />}/>
  <Route path="/browse" element={<Browse />}/>
  <Route path="/ngos/:id" element={<Detail />}/>
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin" element={<Admin />}/>
</Routes>
```

---

## 16) API Layer in React (Axios)

**Files:**
- `d:\DONATEWEB\frontend\src\api\http.js`
- `d:\DONATEWEB\frontend\src\api\ngoApi.js`
- `d:\DONATEWEB\frontend\src\api\metaApi.js`

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

```js
// metaApi.js
export const getCategories = () => api.get("/categories");
export const getBeneficiaries = () => api.get("/beneficiaries");
```

---

## 17) Browse Page Filters (Real UI)

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

## 18) Details Page (NGO Detail View)

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

## 19) Admin Login (Demo Auth)

**File:** `d:\DONATEWEB\frontend\src\pages\AdminLogin.jsx`

**Demo credentials:**
- Email: `admin@login.com`
- Password: `6767`

```js
if (email === 'admin@login.com' && password === "6767") {
  localStorage.setItem("AdminToken", "demo-token");
  navigate("/admin");
} else {
  setErr("Invalid email or password.");
}
```

---

## 20) Admin CRUD (Add, Edit, Delete, Verify)

**File:** `d:\DONATEWEB\frontend\src\pages\Admin.jsx`

**What happens:**
- Loads list of NGOs
- Opens modal to create/edit
- Calls API for CRUD and verify

```js
const list = await getNgos();
setNgos(asData(list));

await createNgo(payload);
await updateNgo(editingNgo.id, payload);
await deleteNgo(ngo.id);
await toggleVerifyNgo(ngo.id);
```

---

## 21) Step-by-Step Data Flow (Real App)

1. User opens Home or Browse page.
2. React triggers Axios call in `frontend/src/api/*`.
3. Express route in `backend/src/routes` receives request.
4. Prisma runs SQL queries using `schema.prisma`.
5. API normalizes response JSON.
6. React renders cards, details, admin table.

---

## 22) Quick Testing Checklist

- Backend health check: `GET /api/health` -> `{ ok: true }`
- Browse page loads NGOs
- Filters return correct results
- Details page opens for one NGO
- Admin login works
- CRUD updates appear in list
- Verify toggle updates status

---

## 23) Summary (Teacher-Friendly)

- Backend: Node/Express REST API with Prisma + PostgreSQL.
- Frontend: React SPA with routing, filters, admin dashboard.
- New structure: NGO routes are modular (`ngos.get.js`, `ngos.post.js`, etc.).
- Data flow: UI -> API -> DB -> clean JSON -> UI.
- Clear separation of concerns makes code easy to test and maintain.

---

End of presentation.
