import { Router } from "express";
import { listLocationsController } from "../controllers/location.controller.js";

const router = Router();

// GET /api/locations?ngoId=1
router.get("/", listLocationsController);

export default router;
