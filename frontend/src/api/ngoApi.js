import api from "./http";

export const getNgos = (params) => {
    return api.get("/ngos", { params });
};

export const getNgoById = (id) => {
    return api.get(`/ngos/${id}`);
};

export const createNgo = (payload) => {
    return api.post("/ngos", payload);
};

export const updateNgo = (id, payload) => {
    return api.patch(`/ngos/${id}`, payload);
};

export const deleteNgo = (id) => {
    return api.delete(`/ngos/${id}`);
};

export const toggleVerifyNgo = (id) => {
    return api.patch(`/ngos/${id}/verify`);
};
