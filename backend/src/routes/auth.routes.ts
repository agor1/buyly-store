import { Router } from "express";
import {
  register,
  login,
  logout,
  updateUserRole,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schemas.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router: Router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.post(
  "/change-role",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateUserRole,
);

export default router;
