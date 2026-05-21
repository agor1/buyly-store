import { Router } from "express";
import { getCheckoutOptions } from "../controllers/checkout.controller.js";

const router = Router();

router.get("/options", getCheckoutOptions);

export default router;
