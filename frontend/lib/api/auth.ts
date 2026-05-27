import api from "./api";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string | null;
  role?: string;
}

export interface AuthResponse {
  user: User;
}

export interface CurrentUserResponse {
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export interface AuthSession {
  user: User;
}

export interface UpdateCurrentUserPayload {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const login = async (payload: LoginPayload): Promise<AuthSession> => {
  const response = await api.post<AuthResponse>("/auth/login", payload);

  return response.data;
};

export const register = async (
  payload: RegisterPayload,
): Promise<AuthSession> => {
  const response = await api.post<AuthResponse>("/auth/register", payload);

  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getCurrentUser = async (): Promise<User | null> => {
  const response = await api.get<CurrentUserResponse>("/auth/me");

  return response.data.user;
};

export const updateCurrentUser = async (
  payload: UpdateCurrentUserPayload,
): Promise<User> => {
  const response = await api.patch<CurrentUserResponse>("/auth/me", payload);

  return response.data.user;
};

export const uploadCurrentUserAvatar = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.post<CurrentUserResponse>(
    "/uploads/avatar",
    formData,
  );

  return response.data.user;
};
