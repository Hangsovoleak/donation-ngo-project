import { listLocations } from "../services/location.service.js";
import { parseId } from "../utils/validators.js";

// GET /api/locations?ngoId=1
export async function listLocationsController(req, res, next) {
  try {
    //for access ngoId parameter from URL and assume format like ?ngoId=123, like converting it to a number
    const ngoId = parseId(req.query.ngoId);
    //for ternery operator sets the where variable: if ngoId->null or undefind -> where -> obj {} if ngoId exist -> where -> { ngo_id:..}
    const where = ngoId == null ? {} : { ngo_id: ngoId };

    //create locations using await to pause the execution of an async function util a Promise is fulfilled as listLocations.
    const locations = await listLocations(where);
    //return locations
    res.json(locations);
  } catch (err) {
    next(err);
  }
}
