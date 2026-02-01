// const BASE = process.env.REACT_APP_API_URL || "http://localhost:300/api";

// export async function httpGet(path) {
//     const res = await fetch(BASE + path);
//     const data = await res.json().catch(() => null);
//     if (!res.ok) {
//         throw new Error(data?.message || "Request failed");
//     }
//     return data;
// }

// export async function httpSend(path, method, bodyObj) {
//     const res = await fetch(BASE + path, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bodyObj),
//     });
//     const data = await res.json().catch(() => null);
//     if (!res.ok) {
//         throw new Error(data?.message || "Request failed");
//     }
//     return data;
// }

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

export default api;
