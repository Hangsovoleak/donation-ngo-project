/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      This controller handles location-related operations, primarily listing
 *      locations associated with specific NGOs.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { listLocations } from "../services/location.service.js";
import { parseId } from "../utils/validators.js";

/*------------------------------------------------------------------------------
                            CONTROLLER FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief List locations function.
 * 
 * Fetches a list of locations, optionally filtered by NGO ID.
 * 
 * @param req Express request object containing query parameters.
 * @param res Express response object.
 * @param next Express next middleware function.
 */
export async function listLocationsController(req, res, next) {
  try {
    // Parse NGO ID from query parameters.
    const ngoId = parseId(req.query.ngoId);
    const where = ngoId == null ? {} : { ngo_id: ngoId };

    // Fetch locations using service layer.
    const locations = await listLocations(where);

    // Return JSON response.
    res.json(locations);
  } catch (err) {
    next(err);
  }
}
