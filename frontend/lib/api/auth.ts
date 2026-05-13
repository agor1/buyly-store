import api from "./api";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
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
  token: string;
}

export interface UpdateCurrentUserPayload {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Login function
export const login = async (payload: LoginPayload): Promise<AuthSession> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register function
export const register = async (
  payload: RegisterPayload,
): Promise<AuthSession> => {
  try {
    const response = await api.post<AuthResponse>("/auth/register", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    throw error;
  }
};

// Get current user function
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<CurrentUserResponse>("/auth/me");
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

// Update current user function
export const updateCurrentUser = async (
  payload: UpdateCurrentUserPayload,
): Promise<User> => {
  try {
    const response = await api.patch<CurrentUserResponse>("/auth/me", payload);
    return response.data.user;
  } catch (error) {
    throw error;
  }
};
