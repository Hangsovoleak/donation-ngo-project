import { Router } from "express";
import prisma from "../db/prisma.js";

const router = Router();

//GET /api/beneficiaries
router.get("/", async (req, res, next) => {
  try {
    const beneficiaries = await prisma.beneficiaries.findMany({
      orderBy: { id : "asc"},
    });

    res.json(beneficiaries);
  } catch (err) {
    next(err);
  }
});

export default router;
