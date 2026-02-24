/**
 * Software Framework: Node.js (jsonwebtoken)
 * Description:
 *      Token management utilities for signing and verifying JWT 
 *      access tokens.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import jwt from "jsonwebtoken";

/*------------------------------------------------------------------------------
                                TOKEN FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Sign access token.
 * 
 * Generates a token for request authorization.
 * 
 * @param payload JWT payload object.
 * @returns Signed JWT string.
 */
export function signAccessToken(payload) {
  const secret = process.env.JWT_SECRET;
  // Set expiry to 15 minutes as requested
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES || "15m";
  return jwt.sign(payload, secret, { expiresIn });
}
