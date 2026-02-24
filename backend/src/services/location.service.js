/**
 * Software Framework: Prisma ORM (Node.js)
 * Description:
 *      Service for database operations related to NGO locations.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import prisma from "../db/prisma.js";

/*------------------------------------------------------------------------------
                            SERVICE FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief List locations.
 * 
 * Fetches locations from the database based on the provided filter.
 * 
 * @param where Prisma where filter object.
 * @returns Array of location records.
 */
export function listLocations(where) {
  return prisma.ngo_locations.findMany({
    where,
    orderBy: { id: "asc" },
  });
}
