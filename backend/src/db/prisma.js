// prisma client only once & reuse it everywhere
// brind prisma's database
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Note: Avoid Prisma middleware here for compatibility across runtimes.

// export default prisma;

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ["query"], // enable only when debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
