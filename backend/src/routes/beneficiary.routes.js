import { Router } from "express";
import { listBeneficiariesController } from "../controllers/beneficiary.controller.js";

const router = Router();

// GET /api/beneficiaries
router.get("/", listBeneficiariesController);

export default router;
