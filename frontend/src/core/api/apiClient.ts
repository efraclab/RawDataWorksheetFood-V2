import axios from "axios";

/**
 * ============================================================
 * V2 API CLIENT
 * ============================================================
 *
 * Browser
 *   ↓
 * http://localhost:5173/api
 *   ↓
 * Vite proxy
 *   ↓
 * http://localhost:5162/api
 *
 * This keeps the browser on the V2 frontend origin and avoids
 * the local HTTPS development certificate problem.
 *
 * IMPORTANT:
 * Existing V1 backend API contracts are NOT changed.
 * ============================================================
 */

export const apiClient = axios.create({
  baseURL: "/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 30000,
});

/**
 * ============================================================
 * REQUEST INTERCEPTOR
 * ============================================================
 *
 * Adds the existing V1 JWT token to every API request.
 *
 * Existing storage key:
 *   authToken
 * ============================================================
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

/**
 * ============================================================
 * RESPONSE INTERCEPTOR
 * ============================================================
 *
 * Preserve the existing V1 behavior:
 *
 * HTTP 401
 *   ↓
 * clear authentication/session data
 *
 * We intentionally do not automatically redirect here.
 * ProtectedRoute/App authentication state remains responsible
 * for navigation.
 * ============================================================
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
    }

    return Promise.reject(error);
  },
);

export default apiClient;
