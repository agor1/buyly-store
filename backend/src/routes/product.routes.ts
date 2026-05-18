import { Router } from "express";
import {
  getSingleProduct,
  getAllProducts,
  createProduct,
  deleteProductById,
  updateProductById,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import {
  createProductSchema,
  getProductsQuerySchema,
} from "../schemas/product.schemas.js";
import {
  validateQuery,
  validateRequest,
} from "../middleware/validation.middleware.js";

const router: Router = Router();

router.get("/:slug", getSingleProduct);
router.get("/", validateQuery(getProductsQuerySchema), getAllProducts);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateRequest(createProductSchema),
  createProduct,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateRequest(createProductSchema),
  updateProductById,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  deleteProductById,
);

export default router;
