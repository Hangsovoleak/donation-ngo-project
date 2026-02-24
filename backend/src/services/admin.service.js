/**
 * Software Framework: Node.js
 * Description:
 *      Service for validating administrative credentials against environment
 *      variables.
 * 
 */

/*------------------------------------------------------------------------------
                            SERVICE FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Validate admin credentials.
 * 
 * Compares provided email and password with environment configurations.
 * 
 * @param email Admin email.
 * @param password Admin password.
 * @returns Boolean indicating if credentials match.
 */
export function validateAdminCredentials(email, password) {
  // Read runtime credentials
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Fail if configuration is incomplete
  if (!adminEmail || !adminPassword) {
    const err = new Error("Admin auth not configured");
    err.statusCode = 500;
    throw err;
  }

  // Perform equality check
  return email === adminEmail && password === adminPassword;
}
