import { Router } from "express";
import prisma from "../db/prisma.js";

const router = Router();

// GET /api/locations?ngoId=1
router.get("/", async (req, res, next) => {
  try {
    const ngoId = parseId(req.query.ngoId);
    const where = ngoId == null ? {} : { ngo_id : ngoId};

    const locations = await prisma.ngo_locations.findMany({
      where,
      orderBy: { id: "asc" },
    });

    res.json(locations);
  } catch (err) {
    next(err);
  }
});

export default router;
