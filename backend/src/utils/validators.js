/**
 * Software Framework: Node.js
 * Description:
 *      Shared helper functions for input validation and data parsing.
 * 
 */

/*------------------------------------------------------------------------------
                            VALIDATION FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Convert value to boolean.
 * 
 * Supports both literal booleans and string representations.
 * 
 * @param value Input value.
 * @returns Boolean value or undefined.
 */
export function toBool(value) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
}

/**
 * @brief Parse numeric ID.
 * 
 * Validates that a value is a finite number and returns it.
 * 
 * @param value Input ID.
 * @returns Valid numeric ID or null.
 */
export function parseId(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
