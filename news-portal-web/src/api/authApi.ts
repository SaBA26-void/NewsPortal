import { api } from "./axiosInstance";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

export async function loginRequest(data: LoginRequest) {
  const res = await api.post<AuthResponse>("/Auth/login", data);
  return res.data;
}

export async function registerRequest(data: RegisterRequest) {
  const res = await api.post<AuthResponse>("/Auth/register", data);
  return res.data;
}
