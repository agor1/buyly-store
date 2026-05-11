import { Router } from "express";
import {
  createNewOrder,
  getAllOrders,
  getUserOrders,
  updateOrder,
} from "../controllers/order.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../schemas/order.schema.js";

const router: Router = Router();

router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), getAllOrders);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["CUSTOMER", "ADMIN"]),
  validateRequest(createOrderSchema),
  createNewOrder,
);
router.get(
  "/my",
  authMiddleware,
  roleMiddleware(["CUSTOMER", "ADMIN"]),
  getUserOrders,
);
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateOrderStatusSchema),
  roleMiddleware(["ADMIN"]),
  updateOrder,
);

export default router;
