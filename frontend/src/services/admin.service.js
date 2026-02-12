import api from "./http";

// Admin auth API calls
export const loginAdmin = (payload) => api.post("/admin/login", payload);
export const refreshAdminToken = (payload) => api.post("/admin/refresh", payload);
export const logoutAdmin = () => api.post("/admin/logout");
