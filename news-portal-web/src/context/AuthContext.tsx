/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import { loginRequest, registerRequest } from "../api/authApi";
import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  UserRole,
} from "../types/auth";
import {
  clearAuth,
  getStoredUser,
  getToken,
  saveAuth,
} from "../utils/tokenStorage";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  canManageArticles: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getToken());

  const login = async (data: LoginRequest) => {
    const res = await loginRequest(data);
    const nextUser: AuthUser = {
      id: res.id,
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      role: res.role as UserRole,
    };
    saveAuth(res.token, nextUser);
    setToken(res.token);
    setUser(nextUser);
  };

  const register = async (data: RegisterRequest) => {
    const res = await registerRequest(data);
    const nextUser: AuthUser = {
      id: res.id,
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      role: res.role as UserRole,
    };
    saveAuth(res.token, nextUser);
    setToken(res.token);
    setUser(nextUser);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const role = user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token && !!user,
        isSuperAdmin: role === "SuperAdmin",
        canManageArticles: role === "Journalist" || role === "SuperAdmin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
