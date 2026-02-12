import prisma from "../db/prisma.js";

// Database access for categories.
export function listCategories() {
  //list content by asc: Ascending and depend it on prisma generate table
  return prisma.categories.findMany({ orderBy: { id: "asc" } });
}
