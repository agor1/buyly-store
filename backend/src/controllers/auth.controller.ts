import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/auth.service";

// Register controller
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const { user, token } = await registerUser({ email, password, name });

    res.json({
      token,
      user: { id: user.id, email: user.email },
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

    res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      res.status(401).json({ error: "Invalid email or password" });
    } else {
      res.status(500).json({ error: "Login failed" });
    }
  }
};
