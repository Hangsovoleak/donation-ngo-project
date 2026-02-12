import prisma from "../db/prisma.js";

// Database access for beneficiaries.
export function listBeneficiaries() {
  //list content by asc: Ascending
  return prisma.beneficiaries.findMany({ orderBy: { id: "asc" } });
}
