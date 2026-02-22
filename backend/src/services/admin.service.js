// Admin credential service flow:
// Step 1: Read admin credentials from environment variables.
// Step 2: Ensure credentials are configured.
// Step 3: Compare incoming credentials with configured values.
// Step 4: Return boolean for controller decision.
export function validateAdminCredentials(email, password) {
  // Step 1: Runtime credentials (demo-level auth model).
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Step 2: Fail fast if auth configuration is incomplete.
  if (!adminEmail || !adminPassword) {
    const err = new Error("Admin auth not configured");
    err.statusCode = 500;
    throw err;
  }

  // Step 3/4: Credential equality check.
  return email === adminEmail && password === adminPassword;
}
