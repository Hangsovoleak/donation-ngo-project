import prisma from "../db/prisma.js";

// Database access for NGO locations.
export function listLocations(where) {
  //findMany for retrieve multiple records from a prisma table with ORM tools
  return prisma.ngo_locations.findMany({
    where,
    orderBy: { id: "asc" },
  });
}
