import { Request, Response } from "express";
import {
  changeUserRole,
  getMe,
  loginUser,
  registerUser,
  updateCurrentUser,
} from "../services/auth.service.js";
import { BadRequestError, UnauthorizedError } from "../errors/app-error.js";
import { AuthRequest } from "../types/authRequest.js";

const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const requireUserId = (req: AuthRequest) => {
  if (!req.userId) {
    throw new UnauthorizedError();
  }

  return req.userId;
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const { user, token } = await registerUser({ email, password, name });

  setAuthCookie(res, token);
  res.json({
    user: { id: user.id, email: user.email },
    token,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser({ email, password });

  setAuthCookie(res, token);
  res.json({
    user: { id: user.id, email: user.email },
    token,
  });
};

export const getCurrrentUser = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const user = await getMe(userId);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
};

export const updateCurrrentUser = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const user = await updateCurrentUser(userId, req.body);

  res.json({ user });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  const { userId, role } = req.body;

  if (!["ADMIN", "CUSTOMER"].includes(role)) {
    throw new BadRequestError("Invalid role");
  }

  const updatedUser = await changeUserRole(userId, role);

  res.json({
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  });
};
