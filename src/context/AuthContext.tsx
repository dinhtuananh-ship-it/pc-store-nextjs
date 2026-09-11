"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Cart, User } from "@/types";

type AuthContextValue = {
  user: User | null;
  cartCount: number;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refreshCart: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "pcstore_user";

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshCart = useCallback(async () => {
    const stored = readStoredUser();
    if (!stored) {
      setCartCount(0);
      return;
    }
    try {
      const res = await api.get<Cart>("/api/cart", true);
      const count =
        res.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    setUser(readStoredUser());
    setLoading(false);
    refreshCart();
  }, [refreshCart]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<User>("/api/auth/login", { email, password });
    const loggedUser = res.data as User;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
    await refreshCart();
    return loggedUser;
  }, [refreshCart]);

  const register = useCallback(
    async (fullName: string, email: string, password: string) => {
      await api.post<User>("/api/auth/register", {
        fullName,
        email,
        password,
      });
      const loggedUser = await login(email, password);
      void loggedUser;
    },
    [login]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setCartCount(0);
    router.push("/");
  }, [router]);

  const value = useMemo(
    () => ({ user, cartCount, loading, login, register, logout, refreshCart }),
    [user, cartCount, loading, login, register, logout, refreshCart]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
