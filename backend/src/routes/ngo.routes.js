import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createNgoController,
  deleteNgoController,
  getNgoController,
  listNgoController,
  updateNgoController,
  verifyNgoController,
} from "../controllers/ngo.controller.js";

const router = Router();

// Public read endpoints
router.get("/", listNgoController);
router.get("/:id", getNgoController);

// Protected write endpoints (admin only)
router.post("/", requireAuth, createNgoController);
router.patch("/:id", requireAuth, updateNgoController);
router.patch("/:id/verify", requireAuth, verifyNgoController);
router.delete("/:id", requireAuth, deleteNgoController);

export default router;
