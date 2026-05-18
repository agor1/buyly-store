import axios from "axios";
import { useAuthStore } from "../store/auth-store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith("/auth/");

    if (
      error.response?.status === 401 &&
      !isAuthRequest &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      useAuthStore.getState().clearSession();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
