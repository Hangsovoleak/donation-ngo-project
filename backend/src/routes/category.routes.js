/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      Routes for listing NGO and donation categories.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { Router } from "express";
import { listCategoriesController } from "../controllers/category.controller.js";

/*------------------------------------------------------------------------------
                                   ROUTES
------------------------------------------------------------------------------*/
const router = Router();

// Category Discovery Endpoints
router.get("/", listCategoriesController);

export default router;
