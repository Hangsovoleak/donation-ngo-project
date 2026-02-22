// NGO API service flow:
// Step 1: Pages call these functions instead of calling axios directly.
// Step 2: Each function maps to one backend NGO endpoint.
// Step 3: Shared auth/refresh behavior is handled inside `http.js`.
import api from "./http";

// GET /api/ngos with optional query params (search, city, category, etc.)
export const getNgos = (params) => api.get("/ngos", { params });

// GET /api/ngos/:id for detail page.
export const getNgoById = (id) => api.get(`/ngos/${id}`);

// POST /api/ngos (admin only).
export const createNgo = (payload) => api.post("/ngos", payload);

// PATCH /api/ngos/:id (admin only).
export const updateNgo = (id, payload) => api.patch(`/ngos/${id}`, payload);

// DELETE /api/ngos/:id (admin only).
export const deleteNgo = (id) => api.delete(`/ngos/${id}`);

// PATCH /api/ngos/:id/verify (admin only).
export const toggleVerifyNgo = (id) => api.patch(`/ngos/${id}/verify`);
