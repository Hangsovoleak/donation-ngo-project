import { Router } from "express";
import prisma from "../db/prisma.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const beneficiaries = await prisma.beneficiaries.findMany({ orderBy: { id: "asc" } });
    res.json(beneficiaries);
  } catch (e) {
    next(e);
  }
});

export default router;
