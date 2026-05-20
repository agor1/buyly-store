import { Router } from "express";
import {
  addItemToFavorites,
  clearUserFavorites,
  getUserFavorites,
  removeItemFromFavorites,
} from "../controllers/favorite.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { addFavoriteItemSchema } from "../schemas/favorite.schemas.js";

const router: Router = Router();

router.use(roleMiddleware(["CUSTOMER", "ADMIN"]));

router.get("/", getUserFavorites);
router.post("/items", validateRequest(addFavoriteItemSchema), addItemToFavorites);
router.delete("/items/:productId", removeItemFromFavorites);
router.delete("/", clearUserFavorites);

export default router;
