// Token utility flow:
// Step 1: Read JWT secrets/expiry from environment.
// Step 2: Sign access token for short-lived authorization.
// Step 3: Sign refresh token for session renewal.
// Step 4: Verify refresh token before issuing new access token.
import jwt from "jsonwebtoken";

// Step 2: Create short-lived access token.
export function signAccessToken(payload) {
  // Step 1: Access token config.
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES || "15m";
  return jwt.sign(payload, secret, { expiresIn });
}

// Step 3: Create long-lived refresh token.
export function signRefreshToken(payload) {
  // Step 1: Refresh token config.
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

// Step 4: Verify refresh token signature/expiry.
export function verifyRefreshToken(token) {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  return jwt.verify(token, secret);
}
