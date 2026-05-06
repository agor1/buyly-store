import { Router } from "express";
import {
  getSingleProduct,
  getAllProducts,
  createProduct,
  deleteProductById,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router: Router = Router();

router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.post("/", authMiddleware, roleMiddleware(["ADMIN"]), createProduct);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  deleteProductById,
);

export default router;
