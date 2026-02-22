// Auth middleware flow:
// Step 1: Read bearer token from Authorization header.
// Step 2: Validate required JWT secret config.
// Step 3: Verify token and attach payload to `req.user`.
// Step 4: Continue request or return 401/500 on failure.
import jwt from "jsonwebtoken";

// Protects admin-only routes.
export function requireAuth(req, res, next) {
  // Step 1: Parse `Authorization: Bearer <token>`.
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  // Step 2: JWT secret must exist in environment.
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  try {
    // Step 3: Verify token signature/expiry and expose claims to next handlers.
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    // Step 4: Invalid or expired token.
    return res.status(401).json({ message: "Invalid token" });
  }
}
