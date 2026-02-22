// NGO controller flow:
// Step 1: Parse and validate request inputs.
// Step 2: Build filters/payloads for service layer.
// Step 3: Call service methods for database actions.
// Step 4: Return API-friendly response shape or pass errors to middleware.
import {
  countNgos,
  createNgo,
  deleteNgo,
  getNgoById,
  listNgos,
  toggleNgoVerification,
  updateNgo,
} from "../services/ngo.service.js";
import { formatNgoDetail, parseNgoCreate, buildNgoUpdate } from "../utils/ngo.utils.js";
import { parseId, toBool } from "../utils/validators.js";

export async function listNgoController(req, res, next) {
  try {
    // Step 1: Parse optional query filters.
    const city = req.query.city ? String(req.query.city) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;
    const verified = toBool(req.query.verified);
    const includeDetails = req.query.include === "details";

    // Step 1B: Parse paging and sorting controls.
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const sortBy = req.query.sortBy ? String(req.query.sortBy) : "id";
    const sortOrder = req.query.sortOrder ? String(req.query.sortOrder) : "asc";

    // Step 2: Build Prisma `where` clause from validated query params.
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

    // Step 2B: Whitelist allowed sort fields to prevent invalid orderBy usage.
    const allowedSort = new Set(["id", "name", "city", "created_at", "updated_at", "verified"]);
    const safeSortBy = allowedSort.has(sortBy) ? sortBy : "id";
    const safeSortOrder = sortOrder === "desc" ? "desc" : "asc";

    // Step 2C: Normalize pagination values and clamp page size.
    const hasPagination = Number.isFinite(page) || Number.isFinite(limit);
    const take = Number.isFinite(limit) ? Math.max(1, Math.min(100, limit)) : undefined;
    const skip = Number.isFinite(page) && take ? Math.max(0, page - 1) * take : undefined;

    // Step 3: Query total count only when pagination metadata is needed.
    const total = hasPagination ? await countNgos(where) : undefined;

    // Step 3B: Query data using service layer.
    const payload = await listNgos({
      where,
      includeDetails,
      sortBy: safeSortBy,
      sortOrder: safeSortOrder,
      skip,
      take,
    });

    // Step 4: Return consistent paginated response shape when requested.
    if (hasPagination) {
      const pageValue = Number.isFinite(page) && page > 0 ? page : 1;
      const limitValue = take || payload.length;
      return res.json({
        data: payload,
        meta: {
          page: pageValue,
          limit: limitValue,
          total: total ?? payload.length,
          totalPages: limitValue ? Math.ceil((total ?? payload.length) / limitValue) : 1,
          sortBy: safeSortBy,
          sortOrder: safeSortOrder,
        },
      });
    }

    // Non-paginated response for simple list requests.
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// GET /api/ngos/:id
export async function getNgoController(req, res, next) {
  try {
    // Step 1: Validate route param.
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Step 3: Fetch one NGO.
    const ngo = await getNgoById(id);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    // Step 4: Return normalized NGO detail payload.
    return res.json(formatNgoDetail(ngo));
  } catch (err) {
    next(err);
  }
}

// POST /api/ngos
export async function createNgoController(req, res, next) {
  try {
    // Step 1: Validate and normalize create payload.
    const input = parseNgoCreate(req.body);
    if (!input.ok) {
      return res.status(400).json({ message: input.error });
    }

    // Step 3/4: Persist and return created resource.
    const created = await createNgo(input.data);
    return res.status(201).json(formatNgoDetail(created));
  } catch (err) {
    next(err);
  }
}

// PATCH /api/ngos/:id
export async function updateNgoController(req, res, next) {
  try {
    // Step 1: Validate route param.
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Step 2/3: Build patch payload and update row.
    const data = buildNgoUpdate(req.body);
    const updated = await updateNgo(id, data);
    // Step 4: Return normalized updated resource.
    return res.json(formatNgoDetail(updated));
  } catch (err) {
    next(err);
  }
}

// PATCH /api/ngos/:id/verify
export async function verifyNgoController(req, res, next) {
  try {
    // Step 1: Validate route param.
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Step 2/3: Parse desired verify value (or toggle) and apply update.
    const nextValue = toBool(req.body?.verified);
    const updated = await toggleNgoVerification(id, nextValue);
    // Step 4: Return minimal verification payload.
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/ngos/:id
export async function deleteNgoController(req, res, next) {
  try {
    // Step 1: Validate route param.
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Step 3/4: Delete resource and return success message.
    await deleteNgo(id);
    return res.json({ message: "NGO deleted" });
  } catch (err) {
    next(err);
  }
}
