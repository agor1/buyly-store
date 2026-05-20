import { Router } from "express";
import {
  createNewOrder,
  getAllOrders,
  getOrder,
  getUserOrder,
  getUserOrders,
  removeOrder,
  updateOrder,
} from "../controllers/order.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  validateQuery,
  validateRequest,
} from "../middleware/validation.middleware.js";
import {
  createOrderSchema,
  getOrdersQuerySchema,
  updateOrderStatusSchema,
} from "../schemas/order.schema.js";

const router: Router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateQuery(getOrdersQuerySchema),
  getAllOrders,
);
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
router.get(
  "/my/:id",
  authMiddleware,
  roleMiddleware(["CUSTOMER", "ADMIN"]),
  getUserOrder,
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getOrder,
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateRequest(updateOrderStatusSchema),
  updateOrder,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  removeOrder,
);

export default router;
