// Simple admin credential check (env-based).
export function validateAdminCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
 
  // check email and psw via correct with what we set in dotenv or not
  if (!adminEmail || !adminPassword) {
    const err = new Error("Admin auth not configured");
    err.statusCode = 500;
    throw err;
  }

  // if correct return it out
  return email === adminEmail && password === adminPassword;
}
