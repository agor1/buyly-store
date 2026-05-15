import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
};

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "Internal Server Error" });
};
