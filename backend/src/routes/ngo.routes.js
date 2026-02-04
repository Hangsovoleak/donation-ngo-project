import { Router } from "express";
import prisma from "../db/prisma.js";

const router = Router();

function toBool(v) {
  if (v === true || v === "true") {
    return true;
  }
  return v === false || v === "false" ? false : undefined;
}

// GET /api/ngos?city=&verified=&search=&category=&include=&limit=&offset=
router.get('/', async (req, res, next) => {
  try {
    const routeStart = Date.now();

    const city = req.query.city ? String(req.query.city) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;
    const verified = toBool(req.query.verified);

    const includeDetails = req.query.include === 'details';

    const limitRaw = Number(req.query.limit);
    const offsetRaw = Number(req.query.offset);

    const take = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 20;
    const skip = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;

    const where = {
      ...(city && { city: { equals: city, mode: "insensitive"}}),
      ...(typeof verified === "boolean" && { verified }),
      ...(category && {
        ngo_categories: {
          some: { categories: { name: { equals: category, mode: "insensitive"}}},
        },
      }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive"}},
          { description: { contains: search, mode: "insensitive"}},
          { city: { contains: search, mode: "insensitive"}},
        ],
      }),
    };

    const queryStart = Date.now();

    const ngos = await prisma.ngos.findMany({
      where,
      orderBy: { id: "asc"},
      take,
      select: {
        id: true,
        name: true,
        description: true,
        city: true,
        image_url: true,
        verified: true,

        created_at: true,
        updated_at: true,
        ngo_categories: { select: { categories: { select: { name: true }}}},
        ...(includeDetails && {
          ngo_beneficiaries: { select: { beneficiaries: { select: { name: true }}},
          },
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

    console.log(
      `[route] GET /api/ngos total=${Date.now() - routeStart}ms db=${Date.now() - queryStart}ms rows=${payload.length} take=${take} skip=${skip} include=${includeDetails ? "details" : "basic"}`
    );

    return res.json(payload);
  } catch (err) {
    next(err);
  }
});

//GET /api/ngos/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id"});
    }

    const ngo = await prisma.ngos.findUnique({
      where: { id },
      select: ngoSelectWithRelations(),
    });

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found"});
    }

    return res.json(formatNgoDetail(ngo));
  } catch (err) {
    next(err);
    }
});

//POST /api/ngos
router.post('/', async (req, res, next) => {
  try {
    const input = parseNgoCreate(req.body);
    if (!input.ok) {
      return res.status(400).json({ message: input.error });
    }

    const created = await prisma.ngos.create({
      data: input.data,
      select: ngoSelectWithRelations(),
    });

    return res.status(201).json(formatNgoDetail(created));
  } catch (err) {
    next(err);
  }
});


//FOR helper function
//=====================================================================================
 //helpers
function parseId(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function ngoSelectWithRelations() {
  return {
    id: true,
    name: true,
    description: true,
    city: true,
    phone: true,
    image_url: true,
    verified: true,

    created_at: true,
    updated_at: true,
    ngo_locations: { select: { link: true }},
    ngo_categories: { select: { categories: { select: { name: true }}}},
    ngo_beneficiaries: { select: { beneficiaries: { select: { name: true }}}},
  };
}

function formatNgoDetail(ngo) {
  const mapLinks = ngo.ngo_locations.map((loc) => loc.link);

  return {
    id: ngo.id,
    name: ngo.name,
    description: ngo.description,
    city: ngo.city,
    phone: ngo.phone,
    image_url: ngo.image_url || null,
    verified: Boolean(ngo.verified),

    created_at: ngo.created_at,
    updated_at: ngo.updated_at,
    categories: ngo.ngo_categories.map((x) => x.categories.name),
    beneficiaries: ngo.ngo_beneficiaries.map((x) => x.beneficiaries.name),
    locations: ngo.ngo_locations.map((loc) => ({ link: loc.link, map_link: loc.link })),
    
    map_link: mapLinks[0] || "",
    map_links: mapLinks,
  };
}

function parseNgoCreate(body) {
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
    return { ok: false, error: "name is required"};
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

function buildCategoryLinks(ids) {
  return Array.isArray(ids) && ids.length
    ? { create: ids.map((id) => ({ category_id: Number(id)}))}
    : undefined;
}

function buildBeneficiaryLinks(ids) {
  return Array.isArray(ids) && ids.length
    ? { create: ids.map((id) => ({ beneficiary_id: Number(id)}))}
    : undefined;
}

function buildLocationLinks(locations) {
  return Array.isArray(locations) && locations.length
    ? { create: locations.map((loc) => ({ link: String(loc.link ?? loc)}))}
    : undefined;
}
//=====================================================================================

// PATCH /api/ngos/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id"});
    }

    const data = buildNgoUpdate(req.body);

    const updated = await prisma.ngos.update({
      where: { id },
      data,
      select: ngoSelectWithRelations(),
    });

    return res.json(formatNgoDetail(updated));
  } catch (err) {
    if (err.code === "P2025") 
      return res.status(404).json({ message: "NGO not found"});
    next(err);
  }
});

//PATCH /api/ngos/:id/verify
router.patch('/:id/verify', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "Invalid id"});
    }

    const nextValue = await resolveVerifyToggle(id, req.body?.verified);

    const updated = await prisma.ngos.update({
      where: { id },
      data: { verified: nextValue},
      select: { id: true, verified: true },
    });

    return res.json(updated);
  } catch (err) {
    if (err.code === "P2025") 
      return res.status(404).json({ message: "NGO not found"});
    next(err);
  }
});

//Helper function for PATCH
//=====================================================================================
function buildNgoUpdate(body) {
  const {
    name,
    description,
    city,
    phone,
    image_url,
    verified,
    categoryIds,
    beneficiaryIds,
    locations,
  } = body || {};

  return {
    ...(name !== undefined && {name}),
    ...(description !== undefined && {description}),
    ...(city !== undefined && {city}),
    ...(phone !== undefined && {phone}),
    ...(image_url !== undefined && {image_url}),
    ...(verified !== undefined && {verified : Boolean(verified)}),
    ...(Array.isArray(categoryIds) && {ngo_categories: {
      deleteMany: {},
      create: categoryIds.map((cid) => ({ category_id: Number(cid)})),
      },
    }),
    ...(Array.isArray(beneficiaryIds) && {ngo_beneficiaries: {
      deleteMany: {},
      create: beneficiaryIds.map((bid) => ({ beneficiary_id: Number(bid)})),
      },
    }),
    ...(Array.isArray(locations) && {ngo_locations: {
      deleteMany: {},
      create: locations.map((loc) => ({ link: String(loc.link ?? loc)})),
      },
    }),
  };
}

async function resolveVerifyToggle(id, verified) {
  const incoming = toBool(verified);
  if (typeof incoming === "boolean") {
    return incoming;
  }

  const current = await prisma.ngos.findUnique({
    where: {id},
    select: {verified: true},
  });

  if (!current) throw notFound();

  return !Boolean(current.verified);
}

function notFound() {
  const err = new Error("NGO not found");
  err.code = "P2025";
  return err;
}
//=====================================================================================

// DELETE /api/ngos/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id == null) {
      return res.status(400).json({ message: "invalid id"});
    }

    await prisma.ngos.delete({ where: { id }});
    return res.json({ message: "NGO deleted"});
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "NGO not found" });
    next(err);
  }
});

export default router;
