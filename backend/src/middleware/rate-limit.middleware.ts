import type { Request, RequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import { TooManyRequestsError } from "../errors/app-error.js";

interface RateLimitOptions {
  limit: number;
  windowMs: number;
  keyPrefix: string;
  getKey: (req: Request) => string | undefined;
  message: string;
  skipSuccessfulRequests?: boolean;
}

export const createRateLimit = ({
  getKey,
  keyPrefix,
  limit,
  message,
  skipSuccessfulRequests = false,
  windowMs,
}: RateLimitOptions): RequestHandler =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests,
    keyGenerator: (req) => {
      const rawKey = getKey(req);

      return `${keyPrefix}:${rawKey ?? "unknown"}`;
    },
    handler: (_req, _res, next) => {
      next(new TooManyRequestsError(message));
    },
  });
