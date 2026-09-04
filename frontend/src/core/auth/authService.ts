import apiClient from "../api/apiClient";
import type {
  LoginRequest,
  LoginResponse,
} from "./authTypes";

const authService = {
  async login(
    request: LoginRequest
  ): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/login",
      request
    );

    const data = response.data;

    if (data.accessToken) {
      localStorage.setItem(
        "accessToken",
        data.accessToken
      );
    }

    if (data.refreshToken) {
      localStorage.setItem(
        "refreshToken",
        data.refreshToken
      );
    }

    return data;
  },

  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem("accessToken"));
  },
};

export default authService;