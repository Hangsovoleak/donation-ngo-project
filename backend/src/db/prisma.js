// prisma.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Create a global PrismaClient instance
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ["query"], // enable only when debugging
  });

// Ensure PrismaClient is only created once in production
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
