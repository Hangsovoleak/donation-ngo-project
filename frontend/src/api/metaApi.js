import api from "./http";

export const getCategories = () => api.get("/categories");
export const getBeneficiaries = () => api.get("/beneficiaries");
