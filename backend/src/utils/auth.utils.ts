import { UnauthorizedError } from "../errors/app-error.js";
import { AuthRequest } from "../types/authRequest.js";

export const requireUserId = (req: AuthRequest) => {
  if (!req.userId) {
    throw new UnauthorizedError();
  }

  return req.userId;
};
