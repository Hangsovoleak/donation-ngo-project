import api from "./http";

// NGO API calls (CRUD)
export const getNgos = (params) => api.get("/ngos", { params });
export const getNgoById = (id) => api.get(`/ngos/${id}`);
export const createNgo = (payload) => api.post("/ngos", payload);
export const updateNgo = (id, payload) => api.patch(`/ngos/${id}`, payload);
export const deleteNgo = (id) => api.delete(`/ngos/${id}`);
export const toggleVerifyNgo = (id) => api.patch(`/ngos/${id}/verify`);
