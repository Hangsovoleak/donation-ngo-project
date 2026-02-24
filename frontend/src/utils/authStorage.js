/**
 * Software Framework: React (Frontend)
 * Description:
 *      V2 Utility for in-memory authentication token storage.
 *      Replaces LocalStorage for enhanced security.
 * 
 */

let inMemoryToken = null;

/**
 * @brief Retrieve admin access token from memory.
 */
export function getAccessToken() {
  return inMemoryToken;
}

/**
 * @brief Set admin access token in memory.
 */
export function setAccessToken(token) {
  inMemoryToken = token;
}

/**
 * @brief Clear all authentication data from memory.
 */
export function clearTokens() {
  inMemoryToken = null;
}
