"use client";

import { useCallback, useState } from "react";
import * as authService from "@/lib/api/auth";
import axios from "axios";
import { useAuthStore } from "@/lib/store/auth-store";

export const useAuth = () => {
  const { user, token, setSession, clearSession } = useAuthStore();
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
          return userData;
        }

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
    [setSession],
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
          return userData;
        }

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
    [setSession],
  );

  // Logout
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
      clearSession();
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Wylogowanie nie powiodło się";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  // Get me
  const getMe = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setSession({ user: userData, token: useAuthStore.getState().token });
      }
      return userData;
    } catch {
      setError(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

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
