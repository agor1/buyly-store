import axios from "axios";
import { useAuthStore } from "../store/auth-store";
import { API_URL } from "./config";

const api = axios.create({
  baseURL: API_URL,
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
