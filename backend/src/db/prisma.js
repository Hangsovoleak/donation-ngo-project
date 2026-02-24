/**
 * Software Framework: Prisma ORM (Node.js)
 * Description:
 *      Initializes and exports a singleton PrismaClient instance for database
 *      access. Ensures a single connection exists in development mode.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { PrismaClient } from "@prisma/client";

/*------------------------------------------------------------------------------
                            DATABASE INITIALIZATION
------------------------------------------------------------------------------*/

const globalForPrisma = globalThis;

/**
 * @brief Initialize Prisma Client.
 * 
 * Create a new PrismaClient instance or reuse an existing one from the 
 * global object.
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ["query"], // enable only when debugging
  });

// Ensure PrismaClient is only created once in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
