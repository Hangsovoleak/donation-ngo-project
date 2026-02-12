import jwt from "jsonwebtoken";

// Create short-lived access token
export function signAccessToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES || "15m";
  return jwt.sign(payload, secret, { expiresIn });
}

// Create long-lived refresh token
export function signRefreshToken(payload) {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

// Verify refresh token
export function verifyRefreshToken(token) {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  return jwt.verify(token, secret);
}
