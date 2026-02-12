import { Router } from "express";
import {
  loginAdminController,
  logoutAdminController,
  refreshAdminController,
} from "../controllers/admin.controller.js";

const router = Router();

// POST /api/admin/login
router.post("/login", loginAdminController);

// POST /api/admin/refresh
router.post("/refresh", refreshAdminController);

// POST /api/admin/logout
router.post("/logout", logoutAdminController);

export default router;
