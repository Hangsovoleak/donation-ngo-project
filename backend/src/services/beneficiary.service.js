/**
 * Software Framework: Prisma ORM (Node.js)
 * Description:
 *      Service for database operations related to beneficiaries.
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
 * @brief List beneficiaries.
 * 
 * Fetches all beneficiaries from the database, ordered by ID.
 * 
 * @returns Array of beneficiary records.
 */
export function listBeneficiaries() {
  return prisma.beneficiaries.findMany({ orderBy: { id: "asc" } });
}
