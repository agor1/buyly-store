import { Router } from "express";
import {
  uploadProductImage,
  uploadUserAvatar,
} from "../controllers/upload.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";

const router: Router = Router();

router.post(
  "/avatar",
  roleMiddleware(["CUSTOMER", "ADMIN"]),
  uploadImage.single("avatar"),
  uploadUserAvatar,
);

router.post(
  "/product-image",
  roleMiddleware(["ADMIN"]),
  uploadImage.single("image"),
  uploadProductImage,
);

export default router;
