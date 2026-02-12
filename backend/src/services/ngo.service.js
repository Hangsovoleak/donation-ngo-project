import prisma from "../db/prisma.js";
import { ngoSelectWithRelations } from "../utils/ngo.utils.js";

// Database access for NGO entities.

export async function listNgos({ where, includeDetails, sortBy, sortOrder, skip, take }) {
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

//for count total donation card
export async function countNgos(where) {
  return prisma.ngos.count({ where });
}

//showing and detail card by their id
export async function getNgoById(id) {
  return prisma.ngos.findUnique({
    where: { id },
    select: ngoSelectWithRelations(),
  });
}

//create new card and display it on page
export async function createNgo(data) {
  return prisma.ngos.create({
    data,
    select: ngoSelectWithRelations(),
  });
}

//update card with any content want to change
export async function updateNgo(id, data) {
  return prisma.ngos.update({
    where: { id },
    data,
    select: ngoSelectWithRelations(),
  });
}

//delete card by id
export async function deleteNgo(id) {
  return prisma.ngos.delete({ where: { id } });
}

//display card depend on verify it or not
export async function toggleNgoVerification(id, verified) {
  if (typeof verified === "boolean") {
    return prisma.ngos.update({
      where: { id },
      data: { verified },
      select: { id: true, verified: true },
    });
  }

  //make this for showing only cards which get verified from admin and display it by id
  const current = await prisma.ngos.findUnique({
    where: { id },
    select: { verified: true },
  });

  if (!current) {
    const err = new Error("NGO not found");
    err.statusCode = 404;
    throw err;
  }

  //return data let's us see
  return prisma.ngos.update({
    where: { id },
    data: { verified: !Boolean(current.verified) },
    select: { id: true, verified: true },
  });
}
