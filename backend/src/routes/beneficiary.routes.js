/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      Routes for managing and listing beneficiaries.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { Router } from "express";
import { listBeneficiariesController } from "../controllers/beneficiary.controller.js";

/*------------------------------------------------------------------------------
                                   ROUTES
------------------------------------------------------------------------------*/
const router = Router();

// Beneficiary Discovery Endpoints
router.get("/", listBeneficiariesController);

export default router;
