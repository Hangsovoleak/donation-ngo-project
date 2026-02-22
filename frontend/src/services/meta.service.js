// Meta API service flow:
// Step 1: UI calls these helpers for reference data.
// Step 2: Each helper maps to one backend metadata endpoint.
// Step 3: Shared auth/retry behavior comes from `http.js`.
import api from "./http";

// GET /api/categories
export const getCategories = () => api.get("/categories");

// GET /api/beneficiaries
export const getBeneficiaries = () => api.get("/beneficiaries");

// GET /api/locations?ngoId=...
export const getLocations = (params) => api.get("/locations", { params });
