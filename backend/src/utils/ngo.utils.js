// Utilities for NGO payload shaping and link building.

export function ngoSelectWithRelations() {
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
    ngo_locations: { select: { link: true } },
    ngo_categories: { select: { categories: { select: { name: true } } } },
    ngo_beneficiaries: { select: { beneficiaries: { select: { name: true } } } },
  };
}

export function formatNgoDetail(ngo) {
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
  } = body || {};

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

export function buildNgoUpdate(body) {
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
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(city !== undefined && { city }),
    ...(phone !== undefined && { phone }),
    ...(image_url !== undefined && { image_url }),
    ...(verified !== undefined && { verified: Boolean(verified) }),
    ...(Array.isArray(categoryIds) && {
      ngo_categories: {
        deleteMany: {},
        create: categoryIds.map((cid) => ({ category_id: Number(cid) })),
      },
    }),
    ...(Array.isArray(beneficiaryIds) && {
      ngo_beneficiaries: {
        deleteMany: {},
        create: beneficiaryIds.map((bid) => ({ beneficiary_id: Number(bid) })),
      },
    }),
    ...(Array.isArray(locations) && {
      ngo_locations: {
        deleteMany: {},
        create: locations.map((loc) => ({ link: String(loc.link ?? loc) })),
      },
    }),
  };
}

function buildCategoryLinks(ids) {
  return Array.isArray(ids) && ids.length
    ? { create: ids.map((id) => ({ category_id: Number(id) })) }
    : undefined;
}

function buildBeneficiaryLinks(ids) {
  return Array.isArray(ids) && ids.length
    ? { create: ids.map((id) => ({ beneficiary_id: Number(id) })) }
    : undefined;
}

function buildLocationLinks(locations) {
  return Array.isArray(locations) && locations.length
    ? { create: locations.map((loc) => ({ link: String(loc.link ?? loc) })) }
    : undefined;
}
