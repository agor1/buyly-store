import { Router } from "express";
import { ipKeyGenerator } from "express-rate-limit";
import { sendContact } from "../controllers/contact.controller.js";
import { createRateLimit } from "../middleware/rate-limit.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { contactSchema } from "../schemas/contact.schemas.js";

const router = Router();

const contactIpRateLimit = createRateLimit({
  keyPrefix: "contact:ip",
  limit: 5,
  windowMs: 15 * 60 * 1000,
  getKey: (req) => ipKeyGenerator(req.ip ?? "unknown"),
  message: "Zbyt wiele wiadomości. Spróbuj ponownie za kilka minut.",
});

const contactEmailRateLimit = createRateLimit({
  keyPrefix: "contact:email",
  limit: 3,
  windowMs: 60 * 60 * 1000,
  getKey: (req) =>
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : undefined,
  message: "Ten adres email wysłał zbyt wiele wiadomości. Spróbuj później.",
});

router.post(
  "/",
  contactIpRateLimit,
  validateRequest(contactSchema),
  contactEmailRateLimit,
  sendContact,
);

export default router;
