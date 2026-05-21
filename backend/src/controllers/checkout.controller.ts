import { Request, Response } from "express";
import { shippingOptions } from "../constants/checkout-options.js";

export const getCheckoutOptions = (_req: Request, res: Response) => {
  res.status(200).json({ shippingOptions });
};
