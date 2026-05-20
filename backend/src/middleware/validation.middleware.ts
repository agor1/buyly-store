import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

const formatZodErrors = (error: ZodError) =>
  error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Podaj poprawne dane",
          details: formatZodErrors(error),
        });
      }

      res.status(400).json({ error: "Invalid request" });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      res.locals.query = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Podaj poprawne parametry zapytania",
          details: formatZodErrors(error),
        });
      }

      res.status(400).json({ error: "Invalid query" });
    }
  };
};
