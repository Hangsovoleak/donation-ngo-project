/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      This controller handles NGO-related operations, including listing,
 *      filtering, creating, updating, and verifying NGO accounts.
 * fully of dashboard admin
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
// NGO controller flow:
// Parse and validate request inputs.
// Build filters/payloads for service layer.
// Call service methods for database actions.
// Return API-friendly response shape or pass errors to middleware.
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

/*------------------------------------------------------------------------------
                            CONTROLLER FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief List and filter NGOs function.
 * 
 * This function handles GET requests to list NGOs with optional filtering,
 * pagination, and sorting.
 * 
 * @param req Express request object containing query parameters.
 * @param res Express response object.
 * @param next Express next middleware function.
 */
export async function listNgoController(req, res, next) {
  try {
    // Parse optional query filters.
    const city = req.query.city ? String(req.query.city) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;
    const verified = toBool(req.query.verified);
    const includeDetails = req.query.include === "details";

    // Parse paging and sorting controls.
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 9);
    const sortBy = req.query.sortBy ? String(req.query.sortBy) : "id";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";

    // Build Prisma `where` clause from validated query params.
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

    // Simple Pagination: Skip records based on current page
    const skip = (page - 1) * limit;

    // Query total count for simple metadata
    const total = await countNgos(where);

    // Query data using service layer.
    const payload = await listNgos({
      where,
      includeDetails,
      sortBy,
      sortOrder,
      skip,
      take: limit,
    });

    // Return simplified response with data and basic meta
    return res.json({
      data: payload,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @brief Get NGO by ID function.
 * 
 * Fetches a single NGO's details based on the provided ID.
 * 
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next middleware function.
 */
// GET /api/ngos/:id
export async function getNgoController(req, res, next) {
  try {
    // Validate route param.
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Fetch one NGO.
    const ngo = await getNgoById(id);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    // Return normalized NGO detail payload.
    return res.json(formatNgoDetail(ngo));
  } catch (err) {
    next(err);
  }
}

/**
 * @brief Create NGO function.
 * 
 * Validates the request body and creates a new NGO entry in the database.
 * 
 * @param req Express request object containing the NGO creation data.
 * @param res Express response object.
 * @param next Express next middleware function.
 */
// POST /api/ngos
export async function createNgoController(req, res, next) {
  try {
    // Validate and normalize create payload.
    const input = parseNgoCreate(req.body);
    if (!input.ok) {
      return res.status(400).json({ message: input.error });
    }

    // Persist and return created resource.
    const created = await createNgo(input.data);
    return res.status(201).json(formatNgoDetail(created));
  } catch (err) {
    next(err);
  }
}

/**
 * @brief Update NGO function.
 * 
 * Updates an existing NGO's information based on the provided ID and body data.
 * 
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next middleware function.
 */
// PATCH /api/ngos/:id
export async function updateNgoController(req, res, next) {
  try {
    // Validate route param.
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Build patch payload and update row.
    const data = buildNgoUpdate(req.body);
    const updated = await updateNgo(id, data);
    // Return normalized updated resource.
    return res.json(formatNgoDetail(updated));
  } catch (err) {
    next(err);
  }
}

/**
 * @brief Verify NGO function.
 * 
 * Toggles or sets the verification status of an NGO.
 * 
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next middleware function.
 */
// PATCH /api/ngos/:id/verify
export async function verifyNgoController(req, res, next) {
  try {
    // Validate route param.
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Parse desired verify value (or toggle) and apply update.
    const nextValue = toBool(req.body?.verified);
    const updated = await toggleNgoVerification(id, nextValue);
    // Return minimal verification payload.
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * @brief Delete NGO function.
 * 
 * Removes an NGO entry from the database based on the provided ID.
 * 
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next middleware function.
 */
// DELETE /api/ngos/:id
export async function deleteNgoController(req, res, next) {
  try {
    // Validate route param.
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Delete resource and return success message.
    await deleteNgo(id);
    return res.json({ message: "NGO deleted" });
  } catch (err) {
    next(err);
  }
}
