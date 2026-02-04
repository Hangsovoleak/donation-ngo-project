import { Router } from "express";
import prisma from "../db/prisma.js";

const router = Router();

//GET /api/categories
router.get("/", async (req, res, next) => {
  try {
    const routeStart = Date.now();

    const queryStart = Date.now();
    const categories = await prisma.categories.findMany({ orderBy: { id: "asc" } });
    const queryMs = Date.now() - queryStart;

    console.log(
      `[route] GET /api/categories total=${Date.now() - routeStart}ms db=${queryMs}ms rows=${categories.length}`
    );

    res.json(categories);
  } catch (err) {
    next(err);
  }
});

export default router;
