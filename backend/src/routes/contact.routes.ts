import { Router } from "express";
import { sendContact } from "../controllers/contact.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { contactSchema } from "../schemas/contact.schemas.js";

const router = Router();

router.post("/", validateRequest(contactSchema), sendContact);

export default router;
