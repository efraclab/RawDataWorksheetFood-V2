import axios from "axios";

/**
 * ============================================================
 * V2 API CLIENT
 * ============================================================
 *
 * Test Server
 *
 * Browser
 *   ↓
 * V2 Frontend :5182
 *   ↓
 * Axios
 *   ↓
 * http://192.168.2.220:5183/api
 *   ↓
 * V1 Backend API
 *
 * Existing V1 backend API contracts are NOT changed.
 * ============================================================
 */

// ============================================================
// API BASE URL
// ============================================================

// Local
const API_BASE_URL = "http://localhost:5162/api";

// Test Server
//const API_BASE_URL = "http://192.168.2.220:5183/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,

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
