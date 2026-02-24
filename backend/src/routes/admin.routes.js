/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      Routes for administrative authentication and session management.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { Router } from "express";
import {
  loginAdminController,
  logoutAdminController,
} from "../controllers/admin.controller.js";

/*------------------------------------------------------------------------------
                                   ROUTES
------------------------------------------------------------------------------*/
const router = Router();

// Admin Authentication Endpoints
router.post("/login", loginAdminController);
router.post("/logout", logoutAdminController);

export default router;
