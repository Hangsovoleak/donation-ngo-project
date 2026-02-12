import api from "./http";

// Meta data API calls (categories, beneficiaries, locations)
export const getCategories = () => api.get("/categories");
export const getBeneficiaries = () => api.get("/beneficiaries");
export const getLocations = (params) => api.get("/locations", { params });
