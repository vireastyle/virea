import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { requestLogger } from "./middleware/requestLogger";
import { generalLimiter } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

// ─── Security headers ────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────
// Only the Next.js origin may call this API in production.
// Credentials: true is required for the httpOnly refresh cookie.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body + cookie parsing ───────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging ─────────────────────────────────────────────
app.use(requestLogger);

// ─── Rate limiting ───────────────────────────────────────
app.use(generalLimiter);

// ─── Routes ──────────────────────────────────────────────
app.use("/api/v1", routes);

// ─── 404 ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

// ─── Error handler (must be last) ────────────────────────
app.use(errorHandler);

export default app;
