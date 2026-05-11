import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  changeUserRole,
  getMe,
} from "../services/auth.service";
import { AuthRequest } from "../types/authRequest";

// Register controller
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const { user, token } = await registerUser({ email, password, name });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    res.json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      res.status(400).json({ error: "Email already in use" });
    } else {
      res.status(500).json({ error: "Registration failed" });
    }
  }
};

// Login controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser({ email, password });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    res.json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      res.status(401).json({ error: "Invalid email or password" });
    } else {
      res.status(500).json({ error: "Login failed" });
    }
  }
};

// Get me controller
export const getCurrrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.userId;
    const user = await getMe(userId);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  }
};

// Logout controller
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};

// Change user role controller (admin only)
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.body;

    if (!["ADMIN", "CUSTOMER"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const updatedUser = await changeUserRole(userId, role);

    res.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Failed to update user role" });
    }
  }
};
