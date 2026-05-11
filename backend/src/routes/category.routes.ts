import { Router } from "express";
import {
  getAllCategories,
  getSingleCategory,
} from "../controllers/category.controller.js";

const router: Router = Router();

router.get("/", getAllCategories);
router.get("/:slug", getSingleCategory);

export default router;
