/**
 * Software Framework: React (Frontend)
 * Description:
 *      Service layer for NGO directory management, supporting 
 *      public browsing and administrator CRUD operations.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import api from "./http";

/*------------------------------------------------------------------------------
                                 NGO SERVICES
------------------------------------------------------------------------------*/

/**
 * @brief Fetch list of NGOs with filtering/pagination.
 * 
 * @param params Query constraints (search, city, category, verified, page, etc).
 * @return Axios Promise with paginated NGO list.
 */
export const getNgos = (params) => api.get("/ngos", { params });

/**
 * @brief Fetch full profile for a specific NGO.
 * 
 * @param id Unique identifier of the NGO.
 * @return Axios Promise with NGO details.
 */
export const getNgoById = (id) => api.get(`/ngos/${id}`);

/**
 * @brief Register a new NGO (Admin only).
 * 
 * @param payload NGO profile data.
 * @return Axios Promise with created NGO.
 */
export const createNgo = (payload) => api.post("/ngos", payload);

/**
 * @brief Update existing NGO profile (Admin only).
 * 
 * @param id NGO identifier.
 * @param payload Partial/Full NGO data updates.
 * @return Axios Promise with updated NGO.
 */
export const updateNgo = (id, payload) => api.patch(`/ngos/${id}`, payload);

/**
 * @brief Permanently remove an NGO (Admin only).
 * 
 * @param id NGO identifier.
 * @return Axios Promise.
 */
export const deleteNgo = (id) => api.delete(`/ngos/${id}`);

/**
 * @brief Toggle the verification badge for an NGO (Admin only).
 * 
 * @param id NGO identifier.
 * @return Axios Promise with updated verification status.
 */
export const toggleVerifyNgo = (id) => api.patch(`/ngos/${id}/verify`);
