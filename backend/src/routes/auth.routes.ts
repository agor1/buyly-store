import { Router } from "express";
import {
  register,
  login,
  logout,
  updateUserRole,
  getCurrrentUser,
  updateCurrrentUser,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import {
  loginSchema,
  registerSchema,
  updateCurrentUserSchema,
} from "../schemas/auth.schemas.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router: Router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getCurrrentUser);
router.patch(
  "/me",
  authMiddleware,
  validateRequest(updateCurrentUserSchema),
  updateCurrrentUser,
);
router.post(
  "/change-role",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateUserRole,
);

export default router;
