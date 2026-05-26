import { NextResponse } from "next/server";

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

export function handleError(err: unknown): NextResponse {
  if (err instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: { code: err.code ?? "ERROR", message: err.message },
      },
      { status: err.statusCode }
    );
  }

  console.error("[API Error]", err);

  return NextResponse.json(
    {
      success: false,
      error: {
        code:    "INTERNAL_SERVER_ERROR",
        message: process.env.NODE_ENV === "production"
          ? "Something went wrong"
          : (err instanceof Error ? err.message : "Unknown error"),
      },
    },
    { status: 500 }
  );
}
