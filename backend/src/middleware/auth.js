/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      Authentication middleware for protecting routes using JWT Bearer tokens.
 *      Verifies token validity and attaches user payload to the request object.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import jwt from "jsonwebtoken";

/*------------------------------------------------------------------------------
                                MIDDLEWARE
------------------------------------------------------------------------------*/

/**
 * @brief Require Authentication middleware.
 * 
 * Validates the JWT token from the Authorization header.
 * 
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next middleware function.
 */
export function requireAuth(req, res, next) {
  // Get Bearer token from Authorization header
  const authHeader = req.headers.authorization || "";
  let token = "";
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }

  if (!token) {
    return res.status(401).json({ message: "Missing token. Please login again." });
  }

  // Ensure JWT secret is configured
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  try {
    // Verify token and attach payload to request
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
