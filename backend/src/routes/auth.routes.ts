import { Router } from "express";
import { ipKeyGenerator } from "express-rate-limit";
import {
  register,
  login,
  logout,
  updateUserRole,
  getCurrentUser,
  updateCurrentUserProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createRateLimit } from "../middleware/rate-limit.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import {
  loginSchema,
  registerSchema,
  updateCurrentUserSchema,
} from "../schemas/auth.schemas.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router: Router = Router();

const loginIpRateLimit = createRateLimit({
  keyPrefix: "auth:login:ip",
  limit: 10,
  windowMs: 15 * 60 * 1000,
  getKey: (req) => ipKeyGenerator(req.ip ?? "unknown"),
  message: "Zbyt wiele prób logowania. Spróbuj ponownie za kilka minut.",
  skipSuccessfulRequests: true,
});

const loginEmailRateLimit = createRateLimit({
  keyPrefix: "auth:login:email",
  limit: 5,
  windowMs: 15 * 60 * 1000,
  getKey: (req) =>
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : undefined,
  message: "Zbyt wiele prób logowania dla tego adresu email. Spróbuj później.",
  skipSuccessfulRequests: true,
});

const registerIpRateLimit = createRateLimit({
  keyPrefix: "auth:register:ip",
  limit: 5,
  windowMs: 60 * 60 * 1000,
  getKey: (req) => ipKeyGenerator(req.ip ?? "unknown"),
  message: "Zbyt wiele prób rejestracji. Spróbuj ponownie później.",
});

router.post(
  "/register",
  registerIpRateLimit,
  validateRequest(registerSchema),
  register,
);
router.post(
  "/login",
  loginIpRateLimit,
  validateRequest(loginSchema),
  loginEmailRateLimit,
  login,
);
router.post("/logout", logout);
router.get("/me", authMiddleware, getCurrentUser);
router.patch(
  "/me",
  authMiddleware,
  validateRequest(updateCurrentUserSchema),
  updateCurrentUserProfile,
);
router.post(
  "/change-role",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateUserRole,
);

export default router;
