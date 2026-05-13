import { Router } from "express";
import {
  addItemToCart,
  clearUserCart,
  getUserCart,
  removeItemFromCart,
  updateItemInCart,
} from "../controllers/cart.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  addCartItemSchema,
  updateCartItemSchema,
} from "../schemas/cart.schemas.js";

const router: Router = Router();

router.use(roleMiddleware(["CUSTOMER", "ADMIN"]));

router.get("/", getUserCart);
router.post("/items", validateRequest(addCartItemSchema), addItemToCart);
router.patch(
  "/items/:productId",
  validateRequest(updateCartItemSchema),
  updateItemInCart,
);
router.delete("/items/:productId", removeItemFromCart);
router.delete("/", clearUserCart);

export default router;
