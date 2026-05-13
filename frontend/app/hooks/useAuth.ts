"use client";

import { useCallback, useState } from "react";
import * as authService from "@/lib/api/auth";
import axios from "axios";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";

export const useAuth = () => {
  const { user, token, setSession, clearSession } = useAuthStore();
  const setCartOwner = useCartStore((state) => state.setCartOwner);
  const loadCart = useCartStore((state) => state.loadCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login
  const login = useCallback(
    async (payload: authService.LoginPayload) => {
      setLoading(true);
      setError(null);
      try {
        const session = await authService.login(payload);
        setSession(session);
        const userData = await authService.getCurrentUser();

        if (userData) {
          setSession({ user: userData, token: session.token });
          setCartOwner(userData.id);
          await loadCart();
          return userData;
        }

        setCartOwner(session.user.id);
        await loadCart();
        return session.user;
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : "Logowanie nie powiodło się";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadCart, setCartOwner, setSession],
  );

  // Register
  const register = useCallback(
    async (payload: authService.RegisterPayload) => {
      setLoading(true);
      setError(null);

      try {
        const session = await authService.register(payload);
        setSession(session);
        const userData = await authService.getCurrentUser();

        if (userData) {
          setSession({ user: userData, token: session.token });
          setCartOwner(userData.id);
          await loadCart();
          return userData;
        }

        setCartOwner(session.user.id);
        await loadCart();
        return session.user;
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : "Rejestracja nie powiodła się";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadCart, setCartOwner, setSession],
  );

  // Logout
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Wylogowanie nie powiodło się";
      setError(errorMessage);
    } finally {
      clearSession();
      setCartOwner(null);
      setLoading(false);
    }
  }, [clearSession, setCartOwner]);

  // Get me
  const getMe = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setSession({ user: userData, token: useAuthStore.getState().token });
        setCartOwner(userData.id);
        await loadCart();
      }
      return userData;
    } catch {
      setError(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadCart, setCartOwner, setSession]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getMe,
    isAuthenticated: !!user,
    token,
  };
};
