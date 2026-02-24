/**
 * Software Framework: React (Frontend)
 * Description:
 *      Service layer for administrative authentication and session 
 *      management API interactions.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import api from "./http";

/*------------------------------------------------------------------------------
                               ADMIN SERVICES
------------------------------------------------------------------------------*/

/**
 * @brief Authenticate admin user.
 * 
 * @param payload Credentials (email, password).
 * @return Axios Promise with auth tokens.
 */
export const loginAdmin = (payload) => api.post("/admin/login", payload);

/**
 * @brief Invalidate current admin session.
 * 
 * @return Axios Promise.
 */
export const logoutAdmin = () => api.post("/admin/logout");
