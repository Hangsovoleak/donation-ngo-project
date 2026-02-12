import { Router } from "express";
import { listCategoriesController } from "../controllers/category.controller.js";

const router = Router();

// GET /api/categories
router.get("/", listCategoriesController);

export default router;
