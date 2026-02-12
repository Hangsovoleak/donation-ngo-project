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

// Controller = reads request, calls service, returns response.

export async function listNgoController(req, res, next) {
  try {
    const city = req.query.city ? String(req.query.city) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;
    const verified = toBool(req.query.verified);
    const includeDetails = req.query.include === "details";

    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const sortBy = req.query.sortBy ? String(req.query.sortBy) : "id";
    const sortOrder = req.query.sortOrder ? String(req.query.sortOrder) : "asc";

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

    const allowedSort = new Set(["id", "name", "city", "created_at", "updated_at", "verified"]);
    const safeSortBy = allowedSort.has(sortBy) ? sortBy : "id";
    const safeSortOrder = sortOrder === "desc" ? "desc" : "asc";

    const hasPagination = Number.isFinite(page) || Number.isFinite(limit);
    const take = Number.isFinite(limit) ? Math.max(1, Math.min(100, limit)) : undefined;
    const skip = Number.isFinite(page) && take ? Math.max(0, page - 1) * take : undefined;

    const total = hasPagination ? await countNgos(where) : undefined;

    const payload = await listNgos({
      where,
      includeDetails,
      sortBy: safeSortBy,
      sortOrder: safeSortOrder,
      skip,
      take,
    });

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

    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

export async function getNgoController(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const ngo = await getNgoById(id);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    return res.json(formatNgoDetail(ngo));
  } catch (err) {
    next(err);
  }
}

export async function createNgoController(req, res, next) {
  try {
    const input = parseNgoCreate(req.body);
    if (!input.ok) {
      return res.status(400).json({ message: input.error });
    }

    const created = await createNgo(input.data);
    return res.status(201).json(formatNgoDetail(created));
  } catch (err) {
    next(err);
  }
}

export async function updateNgoController(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const data = buildNgoUpdate(req.body);
    const updated = await updateNgo(id, data);
    return res.json(formatNgoDetail(updated));
  } catch (err) {
    next(err);
  }
}

export async function verifyNgoController(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const nextValue = toBool(req.body?.verified);
    const updated = await toggleNgoVerification(id, nextValue);
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteNgoController(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    await deleteNgo(id);
    return res.json({ message: "NGO deleted" });
  } catch (err) {
    next(err);
  }
}
