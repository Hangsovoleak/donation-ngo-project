// Admin auth controller flow:
// Step 1: Validate incoming auth payloads.
// Step 2: Verify credentials or refresh token.
// Step 3: Issue JWT access/refresh tokens.
// Step 4: Return minimal auth responses for frontend.
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";
import { validateAdminCredentials } from "../services/admin.service.js";

// POST /api/admin/login
export function loginAdminController(req, res, next) {
  try {
    // Step 1: Read credentials from request body.
    const { email, password } = req.body || {};

    // Step 1B: Basic required-field validation.
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Step 2: Validate admin credentials from env-configured values.
    const ok = validateAdminCredentials(email, password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 3: Issue short-lived access token and long-lived refresh token.
    const accessToken = signAccessToken({ role: "admin", email });
    const refreshToken = signRefreshToken({ role: "admin", email });
    // Step 4: Return tokens expected by frontend auth flow.
    return res.json({ token: accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/refresh
export function refreshAdminController(req, res) {
  // Step 1: Read refresh token from request body.
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  try {
    // Step 2: Verify refresh token signature and claims.
    const payload = verifyRefreshToken(refreshToken);
    // Step 3: Issue a new access token.
    const accessToken = signAccessToken({ role: "admin", email: payload.email });
    // Step 4: Return refreshed access token.
    return res.json({ token: accessToken });
  } catch (err) {
    // Invalid/expired refresh token.
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

// POST /api/admin/logout
export function logoutAdminController(req, res) {
  // JWT-only: client clears tokens; nothing to do server-side
  return res.json({ message: "Logged out" });
}
