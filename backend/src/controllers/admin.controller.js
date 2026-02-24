/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      This controller handles administrative authentication, including login
 *      and logout functionality.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { signAccessToken } from "../utils/tokens.js";
import { validateAdminCredentials } from "../services/admin.service.js";

/*------------------------------------------------------------------------------
                            CONTROLLER FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Admin login function.
 * 
 * Validates credentials and issues an access token for administrative
 * access.
 * 
 * @param req Express request object containing login credentials.
 * @param res Express response object.
 * @param next Express next middleware function.
 */
export function loginAdminController(req, res, next) {
  try {
    // Read credentials from request body.
    const { email, password } = req.body || {};

    // Basic required-field validation.
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate admin credentials.
    const ok = validateAdminCredentials(email, password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Issue short-lived access token.
    const accessToken = signAccessToken({ role: "admin", email });

    // Return success message with token (no cookies)
    return res.json({ message: "Login successful", accessToken });
  } catch (err) {
    next(err);
  }
}

/**
 * @brief Admin logout function.
 * 
 * Returns a success message indicating the user has logged out. Frontend
 * is responsible for clearing stored tokens.
 * 
 * @param req Express request object.
 * @param res Express response object.
 */
export function logoutAdminController(req, res) {
  // JWT-only: client clears tokens; nothing to do server-side
  return res.json({ message: "Logged out" });
}
