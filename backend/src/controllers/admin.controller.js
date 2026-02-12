import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";
import { validateAdminCredentials } from "../services/admin.service.js";

// POST /api/admin/login
export function loginAdminController(req, res, next) {
  try {
    //create one place for storing data of admin
    const { email, password } = req.body || {};

    //if both of email and password are null let's display: email & psw are required
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    //if correct let's define short const and check both of email & psw the same as what we set or not
    const ok = validateAdminCredentials(email, password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //accept it with accessToken which combine by using JWT
    const accessToken = signAccessToken({ role: "admin", email });
    //and get refresh by time we set up so it will be safety and strong
    const refreshToken = signRefreshToken({ role: "admin", email });
    //showing with password as string of accessToken and refreshToken
    return res.json({ token: accessToken, refreshToken });
  } catch (err) {
    next(err); //display error
  }
}

// POST /api/admin/refresh
export function refreshAdminController(req, res) {
  //create one place for storing refresh password of refreshToken as String
  const { refreshToken } = req.body || {};
  //if refreshToken undefind let's display message
  if (!refreshToken) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  try {
    //create payload for claims which statement about an entity like typically, the user
    const payload = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken({ role: "admin", email: payload.email });
    //return accessToken and response it come
    return res.json({ token: accessToken });
  } catch (err) {
    //if get the wrong password of refresh token
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

// POST /api/admin/logout
export function logoutAdminController(req, res) {
  // JWT-only: client clears tokens; nothing to do server-side
  return res.json({ message: "Logged out" });
}
