// NGO service flow:
// Step 1: Receive validated inputs from controllers.
// Step 2: Execute Prisma queries against `ngos` and relation tables.
// Step 3: Normalize DB records into API-friendly response objects.
import prisma from "../db/prisma.js";
import { ngoSelectWithRelations } from "../utils/ngo.utils.js";

// List NGOs with filter/sort/pagination options from controller layer.
export async function listNgos({ where, includeDetails, sortBy, sortOrder, skip, take }) {
  // Step 2: Query NGO rows plus relation names needed by UI cards.
  const ngos = await prisma.ngos.findMany({
    where,
    // Safe sort field/order already validated by controller.
    orderBy: { [sortBy]: sortOrder },
    ...(take ? { take } : {}),
    ...(skip !== undefined ? { skip } : {}),
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

  // Step 3: Flatten relation arrays into simple string arrays.
  return ngos.map((n) => ({
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
}

// Count rows for pagination metadata.
export async function countNgos(where) {
  return prisma.ngos.count({ where });
}

// Fetch one NGO detail payload by id.
export async function getNgoById(id) {
  return prisma.ngos.findUnique({
    where: { id },
    select: ngoSelectWithRelations(),
  });
}

// Create NGO and return full relation-aware payload.
export async function createNgo(data) {
  return prisma.ngos.create({
    data,
    select: ngoSelectWithRelations(),
  });
}

// Update NGO by id and return updated payload.
export async function updateNgo(id, data) {
  return prisma.ngos.update({
    where: { id },
    data,
    select: ngoSelectWithRelations(),
  });
}

// Delete NGO by id.
export async function deleteNgo(id) {
  return prisma.ngos.delete({ where: { id } });
}

// Verify/unverify NGO.
// If `verified` is provided, set that explicit value.
// If omitted, toggle existing value.
export async function toggleNgoVerification(id, verified) {
  if (typeof verified === "boolean") {
    return prisma.ngos.update({
      where: { id },
      data: { verified },
      select: { id: true, verified: true },
    });
  }

  // Read current state for toggle mode.
  const current = await prisma.ngos.findUnique({
    where: { id },
    select: { verified: true },
  });

  // Return 404-like error for missing NGO.
  if (!current) {
    const err = new Error("NGO not found");
    err.statusCode = 404;
    throw err;
  }

  // Toggle and return minimal payload used by admin UI.
  return prisma.ngos.update({
    where: { id },
    data: { verified: !Boolean(current.verified) },
    select: { id: true, verified: true },
  });
}
