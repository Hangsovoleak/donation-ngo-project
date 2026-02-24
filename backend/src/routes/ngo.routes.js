/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      Routes for NGO management, including public discovery and 
 *      administrative control.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
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

/*------------------------------------------------------------------------------
                                   ROUTES
------------------------------------------------------------------------------*/
const router = Router();

// Public Discovery Endpoints
router.get("/", listNgoController);
router.get("/:id", getNgoController);

// Administrative Endpoints (requires authentication)
router.post("/", requireAuth, createNgoController);
router.patch("/:id", requireAuth, updateNgoController);
router.patch("/:id/verify", requireAuth, verifyNgoController);
router.delete("/:id", requireAuth, deleteNgoController);

export default router;
