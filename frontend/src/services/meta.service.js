/**
 * Software Framework: React (Frontend)
 * Description:
 *      Service layer for fetching metadata and reference data 
 *      (categories, beneficiaries, locations).
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import api from "./http";

/*------------------------------------------------------------------------------
                                META SERVICES
------------------------------------------------------------------------------*/

/**
 * @brief Fetch all NGO categories.
 * 
 * @return Axios Promise with category list.
 */
export const getCategories = () => api.get("/categories");

/**
 * @brief Fetch all supported beneficiary groups.
 * 
 * @return Axios Promise with beneficiaries list.
 */
export const getBeneficiaries = () => api.get("/beneficiaries");

/**
 * @brief Fetch project locations.
 * 
 * @param params Filtering parameters (e.g. ngoId).
 * @return Axios Promise with location list.
 */
export const getLocations = (params) => api.get("/locations", { params });
