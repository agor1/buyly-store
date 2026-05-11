import { Response, NextFunction } from "express";
import { AuthRequest, UserRole } from "../types/authRequest.js";

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.role || "GUEST";

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        error: "No permission to access this resource.",
      });
    }
    next();
  };
};
