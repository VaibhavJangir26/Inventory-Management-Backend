import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

export const ZodValidation = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (ZodError) {
        res.status(400).json({ msg: "req body is not correct", error: error });
      } else {
        next();
      }
    }
  };
};
