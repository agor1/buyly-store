import { Request } from "express";

export type UserRole = "GUEST" | "CUSTOMER" | "ADMIN";

export interface AuthRequest extends Request {
  userId?: string;
  role?: UserRole;
}
