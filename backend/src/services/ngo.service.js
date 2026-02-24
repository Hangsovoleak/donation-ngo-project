/**
 * Software Framework: Prisma ORM (Node.js)
 * Description:
 *      Service for comprehensive NGO database operations including 
 *      filtering, listing, and lifecycle management.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import prisma from "../db/prisma.js";
import { ngoSelectWithRelations } from "../utils/ngo.utils.js";

/*------------------------------------------------------------------------------
                            SERVICE FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief List and filter NGOs.
 * 
 * Queries NGOs with relations, applying filters, sorting, and pagination.
 * 
 * @param params Filtering, sorting, and pagination parameters.
 * @returns Normalized array of NGO records.
 */
export async function listNgos({ where, includeDetails, sortBy, sortOrder, skip, take }) {
  // Query NGO data with relations
  const ngos = await prisma.ngos.findMany({
    where,
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

  // Normalize and flatten relation arrays
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

/**
 * @brief Count NGOs.
 * 
 * Returns the total count of NGOs matching a filter.
 * 
 * @param where Prisma where filter object.
 * @returns Total count.
 */
export async function countNgos(where) {
  return prisma.ngos.count({ where });
}

/**
 * @brief Get NGO by ID.
 * 
 * @param id NGO ID.
 * @returns Unique NGO record with full relations.
 */
export async function getNgoById(id) {
  return prisma.ngos.findUnique({
    where: { id },
    select: ngoSelectWithRelations(),
  });
}

/**
 * @brief Create NGO.
 * 
 * @param data NGO creation data.
 * @returns Created NGO record.
 */
export async function createNgo(data) {
  return prisma.ngos.create({
    data,
    select: ngoSelectWithRelations(),
  });
}

/**
 * @brief Update NGO.
 * 
 * @param id NGO ID.
 * @param data Update payload.
 * @returns Updated NGO record.
 */
export async function updateNgo(id, data) {
  return prisma.ngos.update({
    where: { id },
    data,
    select: ngoSelectWithRelations(),
  });
}

/**
 * @brief Delete NGO.
 * 
 * @param id NGO ID.
 */
export async function deleteNgo(id) {
  return prisma.ngos.delete({ where: { id } });
}

/**
 * @brief Toggle NGO Verification.
 * 
 * Sets an explicit verification value or toggles the current state.
 * 
 * @param id NGO ID.
 * @param verified Optional boolean verification value.
 * @returns Minimal NGO record with updated status.
 */
export async function toggleNgoVerification(id, verified) {
  if (typeof verified === "boolean") {
    return prisma.ngos.update({
      where: { id },
      data: { verified },
      select: { id: true, verified: true },
    });
  }

  // Read current state for toggle mode
  const current = await prisma.ngos.findUnique({
    where: { id },
    select: { verified: true },
  });

  if (!current) {
    const err = new Error("NGO not found");
    err.statusCode = 404;
    throw err;
  }

  // Toggle state
  return prisma.ngos.update({
    where: { id },
    data: { verified: !Boolean(current.verified) },
    select: { id: true, verified: true },
  });
}
