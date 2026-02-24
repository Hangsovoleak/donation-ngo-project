/**
 * Software Framework: Prisma ORM (Node.js)
 * Description:
 *      Service for database operations related to NGO categories.
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
 * @brief List categories.
 * 
 * Fetches all categories from the database, ordered by ID.
 * 
 * @returns Array of category records.
 */
export function listCategories() {
  return prisma.categories.findMany({ orderBy: { id: "asc" } });
}
