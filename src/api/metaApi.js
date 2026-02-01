// import { httpGet } from "./http";

// export function getCategories() {
//     return httpGet("/categories");
// }

// export function getBeneficiaries() {
//     return httpGet("/beneficiaries");
// }

import api from "./http";

export const getCategories = () => api.get("/categories");
export const getBeneficiaries = () => api.get("/beneficiaries");
