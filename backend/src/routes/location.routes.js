/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      Routes for listing and filtering geographic locations.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { Router } from "express";
import { listLocationsController } from "../controllers/location.controller.js";

/*------------------------------------------------------------------------------
                                   ROUTES
------------------------------------------------------------------------------*/
const router = Router();

// Location Discovery Endpoints
router.get("/", listLocationsController);

export default router;
