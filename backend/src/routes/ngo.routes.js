import { Router } from "express";
import prisma from "../db/prisma.js";

const router = Router();

function toBool(v) {
  if (v === true) return true;
  if (v === false) return false;
  if (v === "true") return true;
  if (v === "false") return false;
  return undefined;
}

// GET /api/ngos?city=&verified=&search=&category=&include=&limit=&offset=
router.get("/", async (req, res, next) => {
  try {
    const routeStart = Date.now();

    const city = req.query.city ? String(req.query.city) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;
    const verified = toBool(req.query.verified);

    const includeDetails = String(req.query.include || "") === "details";

    const limitRaw = Number(req.query.limit);
    const offsetRaw = Number(req.query.offset);

    const take = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 20;
    const skip = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;

    const where = {
      ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
      ...(typeof verified === "boolean" ? { verified } : {}),
      ...(category
        ? {
            ngo_categories: {
              some: {
                categories: { name: { equals: category, mode: "insensitive" } },
              },
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { city: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const queryStart = Date.now();

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
        verified: true,
        created_at: true,
        updated_at: true,
        ngo_categories: { select: { categories: { select: { name: true } } } },
        ...(includeDetails
          ? {
              ngo_beneficiaries: {
                select: { beneficiaries: { select: { name: true } } },
              },
            }
          : {}),
      },
    });

    const payload = ngos.map((n) => ({
      id: n.id,
      name: n.name,
      description: n.description,
      short_description:
        typeof n.description === "string" && n.description.length > 140
          ? `${n.description.slice(0, 140)}...`
          : n.description || null,
      city: n.city,
      verified: Boolean(n.verified),
      created_at: n.created_at,
      updated_at: n.updated_at,
      categories: n.ngo_categories.map((x) => x.categories.name),
      beneficiaries: includeDetails ? n.ngo_beneficiaries.map((x) => x.beneficiaries.name) : [],
    }));

    console.log(
      `[route] GET /api/ngos total=${Date.now() - routeStart}ms db=${Date.now() - queryStart}ms rows=${payload.length} take=${take} skip=${skip} include=${includeDetails ? "details" : "basic"}`
    );

    return res.json(payload);
  } catch (e) {
    next(e);
  }
});

// GET /api/ngos/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    const ngo = await prisma.ngos.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        city: true,
        phone: true,
        donation_info: true,
        needs: true,
        verified: true,
        created_at: true,
        updated_at: true,
        ngo_locations: { select: { link: true } },
        ngo_categories: { select: { categories: { select: { name: true } } } },
        ngo_beneficiaries: { select: { beneficiaries: { select: { name: true } } } },
      },
    });

    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    const mapLinks = ngo.ngo_locations.map((loc) => loc.link);

    return res.json({
      id: ngo.id,
      name: ngo.name,
      description: ngo.description,
      city: ngo.city,
      phone: ngo.phone,
      donation_info: ngo.donation_info,
      needs: ngo.needs,
      verified: Boolean(ngo.verified),
      created_at: ngo.created_at,
      updated_at: ngo.updated_at,
      categories: ngo.ngo_categories.map((x) => x.categories.name),
      beneficiaries: ngo.ngo_beneficiaries.map((x) => x.beneficiaries.name),
      locations: ngo.ngo_locations.map((loc) => ({ link: loc.link, map_link: loc.link })),
      map_link: mapLinks[0] || "",
      map_links: mapLinks,
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/ngos
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      description,
      city,
      phone,
      donation_info,
      needs,
      verified = false,
      categoryIds = [],
      beneficiaryIds = [],
      locations = [],
    } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }

    const created = await prisma.ngos.create({
      data: {
        name,
        description,
        city,
        phone,
        donation_info,
        needs,
        verified: Boolean(verified),

        ngo_categories: Array.isArray(categoryIds) && categoryIds.length
          ? { create: categoryIds.map((cid) => ({ category_id: Number(cid) })) }
          : undefined,

        ngo_beneficiaries: Array.isArray(beneficiaryIds) && beneficiaryIds.length
          ? { create: beneficiaryIds.map((bid) => ({ beneficiary_id: Number(bid) })) }
          : undefined,

        ngo_locations: Array.isArray(locations) && locations.length
          ? { create: locations.map((l) => ({ link: String(l.link ?? l) })) }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        description: true,
        city: true,
        phone: true,
        donation_info: true,
        needs: true,
        verified: true,
        created_at: true,
        updated_at: true,
        ngo_locations: { select: { link: true } },
        ngo_categories: { select: { categories: { select: { name: true } } } },
        ngo_beneficiaries: { select: { beneficiaries: { select: { name: true } } } },
      },
    });

    const mapLinks = created.ngo_locations.map((l) => l.link);

    return res.status(201).json({
      id: created.id,
      name: created.name,
      description: created.description,
      city: created.city,
      phone: created.phone,
      donation_info: created.donation_info,
      needs: created.needs,
      verified: Boolean(created.verified),
      created_at: created.created_at,
      updated_at: created.updated_at,
      categories: created.ngo_categories.map((x) => x.categories.name),
      beneficiaries: created.ngo_beneficiaries.map((x) => x.beneficiaries.name),
      locations: created.ngo_locations.map((loc) => ({ link: loc.link, map_link: loc.link })),
      map_link: mapLinks[0]?.link || mapLinks[0] || "",
      map_links: mapLinks,
    });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/ngos/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    const {
      name,
      description,
      city,
      phone,
      donation_info,
      needs,
      verified,
      categoryIds,
      beneficiaryIds,
      locations,
    } = req.body;

    const updated = await prisma.ngos.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(city !== undefined ? { city } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(donation_info !== undefined ? { donation_info } : {}),
        ...(needs !== undefined ? { needs } : {}),
        ...(verified !== undefined ? { verified: Boolean(verified) } : {}),

        ...(Array.isArray(categoryIds)
          ? {
              ngo_categories: {
                deleteMany: {},
                create: categoryIds.map((cid) => ({ category_id: Number(cid) })),
              },
            }
          : {}),

        ...(Array.isArray(beneficiaryIds)
          ? {
              ngo_beneficiaries: {
                deleteMany: {},
                create: beneficiaryIds.map((bid) => ({ beneficiary_id: Number(bid) })),
              },
            }
          : {}),

        ...(Array.isArray(locations)
          ? {
              ngo_locations: {
                deleteMany: {},
                create: locations.map((l) => ({ link: String(l.link ?? l) })),
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        description: true,
        city: true,
        phone: true,
        donation_info: true,
        needs: true,
        verified: true,
        created_at: true,
        updated_at: true,
        ngo_locations: { select: { link: true } },
        ngo_categories: { select: { categories: { select: { name: true } } } },
        ngo_beneficiaries: { select: { beneficiaries: { select: { name: true } } } },
      },
    });

    const mapLinks = updated.ngo_locations.map((l) => l.link);

    return res.json({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      city: updated.city,
      phone: updated.phone,
      donation_info: updated.donation_info,
      needs: updated.needs,
      verified: Boolean(updated.verified),
      created_at: updated.created_at,
      updated_at: updated.updated_at,
      categories: updated.ngo_categories.map((x) => x.categories.name),
      beneficiaries: updated.ngo_beneficiaries.map((x) => x.beneficiaries.name),
      locations: updated.ngo_locations.map((loc) => ({ link: loc.link, map_link: loc.link })),
      map_link: mapLinks[0] || "",
      map_links: mapLinks,
    });
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ message: "NGO not found" });
    next(e);
  }
});

// PATCH /api/ngos/:id/verify
router.patch("/:id/verify", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    const incoming = toBool(req.body?.verified);
    let nextValue;

    if (typeof incoming === "boolean") {
      nextValue = incoming;
    } else {
      const current = await prisma.ngos.findUnique({
        where: { id },
        select: { verified: true },
      });
      if (!current) return res.status(404).json({ message: "NGO not found" });
      nextValue = !Boolean(current.verified);
    }

    const updated = await prisma.ngos.update({
      where: { id },
      data: { verified: nextValue },
      select: { id: true, verified: true },
    });

    return res.json(updated);
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ message: "NGO not found" });
    next(e);
  }
});

// DELETE /api/ngos/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    await prisma.ngos.delete({ where: { id } });
    return res.json({ message: "Deleted" });
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ message: "NGO not found" });
    next(e);
  }
});

export default router;
