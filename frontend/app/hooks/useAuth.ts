"use client";

import { useCallback, useEffect, useState } from "react";
import * as authService from "@/lib/auth";
import axios from "axios";

export const useAuth = () => {
  const [user, setUser] = useState<authService.User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login
  const login = useCallback(async (payload: authService.LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.login(payload);
      setUser(userData);
      return userData;
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
  }, []);

  // Register
  const register = useCallback(async (payload: authService.RegisterPayload) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.register(payload);
      setUser(userData);
      return userData;
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
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Wylogowanie nie powiodło się";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get me
  const getMe = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
      }
      return userData;
    } catch (err) {
      setError(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getMe,
    isAuthenticated: !!user,
  };
};
