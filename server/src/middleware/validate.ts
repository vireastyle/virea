import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type Target = "body" | "query" | "params";

// Factory: returns a middleware that validates req[target] against a Zod schema.
// On failure it responds 422 with a structured list of field errors.
// On success it replaces req[target] with the parsed (coerced + stripped) value.
export function validate(schema: ZodSchema, target: Target = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      res.status(422).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          fields: errors,
        },
      });
      return;
    }

    // Replace with parsed output (strips unknown keys, coerces types)
    (req as unknown as Record<string, unknown>)[target] = result.data;
    next();
  };
}
