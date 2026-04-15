import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  API_BASE_URL,
  TOKEN_KEY,
  USER_KEY,
  TokenResponse,
  apiFetch,
  clearStoredAuth,
  parseApiError,
} from "../utils/api";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }, {
      authenticated: false,
    });

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Credenciais inválidas"));
    }

    const data: TokenResponse = await res.json();
    setToken(data.access_token);
    setUser({ email });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const res = await apiFetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }, {
      authenticated: false,
    });

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Erro ao criar conta"));
    }

    const data: TokenResponse = await res.json();
    setToken(data.access_token);
    setUser({ email });
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
