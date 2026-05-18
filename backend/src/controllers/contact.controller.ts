import { Request, Response } from "express";
import { sendContactMessage } from "../services/mail.service.js";

export const sendContact = async (req: Request, res: Response) => {
  await sendContactMessage(req.body);

  res.status(200).json({
    message: "Wiadomość została wysłana.",
  });
};
