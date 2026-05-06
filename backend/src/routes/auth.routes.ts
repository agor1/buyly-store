import { Router } from "express";
import { register, login, updateUserRole } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/change-role", authMiddleware, roleMiddleware(["ADMIN"]), updateUserRole);

export default router;
