// Utilities for NGO payload shaping and link building.

export function ngoSelectWithRelations() {
  //select fields for NGO entities and relations
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
  //map NGO locations to return object
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
  //parse NGO create payload and return object
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

  //validate NGO create payload
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
  //build NGO update payload and return object using for NGO update
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

  //build NGO update payload and return object using for NGO update
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

//build NGO category links and return object using for NGO create
function buildCategoryLinks(ids) {
  return Array.isArray(ids) && ids.length
    ? { create: ids.map((id) => ({ category_id: Number(id) })) }
    : undefined;
}

//build NGO beneficiary links and return object using for NGO update
function buildBeneficiaryLinks(ids) {
  return Array.isArray(ids) && ids.length
    ? { create: ids.map((id) => ({ beneficiary_id: Number(id) })) }
    : undefined;
}

//build NGO location links and return object using for NGO update
function buildLocationLinks(locations) {
  return Array.isArray(locations) && locations.length
    ? { create: locations.map((loc) => ({ link: String(loc.link ?? loc) })) }
    : undefined;
}
