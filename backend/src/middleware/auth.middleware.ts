import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AuthRequest } from "../types/authRequest.js";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1] ?? req.cookies?.token;

  if (!token) {
    req.role = "GUEST";
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      role: "CUSTOMER" | "ADMIN";
    };

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    req.role = "GUEST";
    next();
  }
};
