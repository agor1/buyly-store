import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;

      next();
    } catch (error: any) {
      if (error.issues) {
        const formattedErrors = error.issues.map((issue: any) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          error: "Podaj poprawne dane",
          details: formattedErrors,
        });
      }

      res.status(400).json({ error: "Invalid request" });
    }
  };
};
