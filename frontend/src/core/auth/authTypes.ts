export interface AuthUser {
  id: string;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser;
}