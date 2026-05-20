import { Router } from "express";
import { uploadProductImage } from "../controllers/upload.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";

const router: Router = Router();

router.use(roleMiddleware(["ADMIN"]));

router.post("/product-image", uploadImage.single("image"), uploadProductImage);

export default router;
