"use client";

import { useCallback, useState } from "react";
import * as authService from "@/lib/api/auth";
import axios from "axios";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";

export const useAuth = () => {
  const { user, setSession, clearSession } = useAuthStore();
  const setCartOwner = useCartStore((state) => state.setCartOwner);
  const loadCart = useCartStore((state) => state.loadCart);
  const setFavoritesOwner = useFavoritesStore((state) => state.setFavoritesOwner);
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);
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
          setSession({ user: userData });
          setCartOwner(userData.id);
          setFavoritesOwner(userData.id);
          await loadCart();
          await loadFavorites();
          return userData;
        }

        setCartOwner(session.user.id);
        setFavoritesOwner(session.user.id);
        await loadCart();
        await loadFavorites();
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
    [loadCart, loadFavorites, setCartOwner, setFavoritesOwner, setSession],
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
          setSession({ user: userData });
          setCartOwner(userData.id);
          setFavoritesOwner(userData.id);
          await loadCart();
          await loadFavorites();
          return userData;
        }

        setCartOwner(session.user.id);
        setFavoritesOwner(session.user.id);
        await loadCart();
        await loadFavorites();
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
    [loadCart, loadFavorites, setCartOwner, setFavoritesOwner, setSession],
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
      setFavoritesOwner(null);
      setLoading(false);
    }
  }, [clearSession, setCartOwner, setFavoritesOwner]);

  // Get me
  const getMe = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setSession({ user: userData });
        setCartOwner(userData.id);
        setFavoritesOwner(userData.id);
        await loadCart();
        await loadFavorites();
      }
      return userData;
    } catch {
      setError(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadCart, loadFavorites, setCartOwner, setFavoritesOwner, setSession]);

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
