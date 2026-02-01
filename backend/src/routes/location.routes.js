import { Router } from "express";
import prisma from "../db/prisma.js";

const router = Router();

// GET /api/locations?ngoId=1
router.get("/", async (req, res, next) => {
  try {
    const ngoId = req.query.ngoId ? Number(req.query.ngoId) : null;
    const where = ngoId ? { ngo_id: ngoId } : {};

    const locations = await prisma.ngo_locations.findMany({
      where,
      orderBy: { id: "asc" },
    });

    res.json(locations);
  } catch (e) {
    next(e);
  }
});

export default router;
