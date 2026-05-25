import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Centralised error handler — must be registered LAST in app.ts.
// Catches anything thrown or passed to next(err) in controllers.
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code ?? "ERROR",
        message: err.message,
      },
    });
    return;
  }

  // Zod validation errors bubble up as plain Errors with a `issues` property
  // (set by the validate middleware — already formatted before reaching here).

  console.error("[Unhandled Error]", err);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "Something went wrong"
          : err.message,
    },
  });
}
