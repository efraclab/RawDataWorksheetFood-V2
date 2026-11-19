export interface LoginRequest {
  employeeId: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  message?: string;
}

export interface AuthUser {
  employeeId: string;
  username: string;
  department: string;
  role: string;
}
