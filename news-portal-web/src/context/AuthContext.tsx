/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loginRequest, registerRequest } from "../api/authApi";
import type {
  AuthResponse,
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
  token: string | null;
  isAuthenticated: boolean;
  isJournalist: boolean;
  isSuperAdmin: boolean;
  canManageArticles: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toUser(res: AuthResponse): AuthUser {
  return {
    id: res.id,
    firstName: res.firstName,
    lastName: res.lastName,
    email: res.email,
    role: res.role as UserRole,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getToken());

  const login = async (data: LoginRequest) => {
    const res = await loginRequest(data);
    const nextUser = toUser(res);
    saveAuth(res.token, nextUser);
    setToken(res.token);
    setUser(nextUser);
  };

  const register = async (data: RegisterRequest) => {
    const res = await registerRequest(data);
    const nextUser = toUser(res);
    saveAuth(res.token, nextUser);
    setToken(res.token);
    setUser(nextUser);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => {
    const role = user?.role;
    return {
      user,
      token,
      isAuthenticated: !!token && !!user,
      isJournalist: role === "Journalist",
      isSuperAdmin: role === "SuperAdmin",
      canManageArticles: role === "Journalist" || role === "SuperAdmin",
      login,
      register,
      logout,
    };
  }, [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
