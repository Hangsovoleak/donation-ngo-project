/**
 * Software Framework: React (Frontend)
 * Description:
 *      Centralized HTTP client configuration using Axios, featuring 
 *      automatic token injection and transparent JWT refresh flows.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import axios from "axios";
import {
  getAccessToken,
} from "../utils/authStorage";

/*------------------------------------------------------------------------------
                                CLIENT CONFIG
------------------------------------------------------------------------------*/

/**
 * @brief Shared API client instance.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

/*------------------------------------------------------------------------------
                                INTERCEPTORS
------------------------------------------------------------------------------*/

/**
 * @brief Inject Authorization header into outgoing requests.
 */
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * @brief Handle response errors.
 * 
 * Simply rejects errors; the browser will return 401 if the token expires.
 */
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
