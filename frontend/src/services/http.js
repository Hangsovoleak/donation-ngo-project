// HTTP client flow:
// Step 1: Create one shared Axios instance with API base URL.
// Step 2: Attach access token on every outgoing request.
// Step 3: On 401, try refresh token once and retry original request.
// Step 4: If refresh fails, clear tokens and return auth error.
import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "../utils/authStorage";

// Step 1: Shared API client used by all frontend service modules.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Step 2: Add Authorization header automatically when a token exists.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Step 3/4: Refresh flow for expired access tokens.
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    // `original` keeps the failed request so we can retry it after refresh.
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return Promise.reject(err);
      }
      try {
        const refresh = await api.post("/admin/refresh", { refreshToken });
        const newToken = refresh.data?.token;
        if (newToken) {
          setAccessToken(newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      } catch (refreshErr) {
        // Refresh failed: force sign-out behavior on client.
        clearTokens();
      }
    }
    return Promise.reject(err);
  }
);

export default api;
