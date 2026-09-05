import { apiClient } from "../api";

import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from "./authTypes";

const AUTH_TOKEN_KEY = "authToken";

const USER_KEYS = {
  employeeId: "EmployeeId",
  username: "Username",
  department: "Department",
  role: "Role",
} as const;

const decodeJwtPayload = (
  token: string
): Record<string, unknown> | null => {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    let base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

const storeUserData = (
  payload: Record<string, unknown>
): AuthUser | null => {
  if (!payload) {
    return null;
  }

  const user: AuthUser = {
    employeeId: String(
      payload.EmployeeId ?? ""
    ),

    username: String(
      payload.Username ?? ""
    ),

    department: String(
      payload.Department ?? ""
    ),

    role: String(
      payload.Role ?? ""
    ),
  };

  localStorage.setItem(
    USER_KEYS.employeeId,
    user.employeeId
  );

  localStorage.setItem(
    USER_KEYS.username,
    user.username
  );

  localStorage.setItem(
    USER_KEYS.department,
    user.department
  );

  localStorage.setItem(
    USER_KEYS.role,
    user.role
  );

  return user;
};

const isTokenExpired = (
  token: string
): boolean => {
  try {
    const payload =
      decodeJwtPayload(token);

    if (!payload?.exp) {
      return true;
    }

    return (
      Number(payload.exp) * 1000 <
      Date.now()
    );
  } catch {
    return true;
  }
};

export const authService = {
  async login(
    credentials: LoginRequest
  ): Promise<LoginResponse> {
    /*
     * apiClient baseURL = "/api"
     *
     * Therefore the final URL is:
     *
     * http://localhost:5173/api/auth/login
     *
     * Vite proxy forwards it to:
     *
     * https://localhost:7078/api/auth/login
     */
    const response =
      await apiClient.post<LoginResponse>(
        "/auth/login",
        {
          employeeId:
            credentials.employeeId,

          password:
            credentials.password,
        }
      );

    const data = response.data;

    if (!data?.token) {
      throw new Error(
        data?.message ||
          "Invalid credentials."
      );
    }

    localStorage.setItem(
      AUTH_TOKEN_KEY,
      data.token
    );

    const payload =
      decodeJwtPayload(data.token);

    if (!payload) {
      localStorage.removeItem(
        AUTH_TOKEN_KEY
      );

      throw new Error(
        "Token decoding failed."
      );
    }

    storeUserData(payload);

    return data;
  },

  logout(): void {
    /*
     * Preserve V1 behavior.
     */
    localStorage.clear();
  },

  getToken(): string | null {
    return localStorage.getItem(
      AUTH_TOKEN_KEY
    );
  },

  isAuthenticated(): boolean {
    const token =
      this.getToken();

    if (!token) {
      return false;
    }

    if (isTokenExpired(token)) {
      this.logout();

      return false;
    }

    return true;
  },

  getCurrentUser(): AuthUser {
    return {
      employeeId:
        localStorage.getItem(
          USER_KEYS.employeeId
        ) || "Unknown",

      username:
        localStorage.getItem(
          USER_KEYS.username
        ) || "Unknown",

      department:
        localStorage.getItem(
          USER_KEYS.department
        ) || "Unknown",

      role:
        localStorage.getItem(
          USER_KEYS.role
        ) || "Unknown",
    };
  },

  clearSession(): void {
    this.logout();
  },
};