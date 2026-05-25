import morgan from "morgan";

// Concise coloured request logger for development.
// In production, use the "combined" format and pipe to a log aggregator.
export const requestLogger = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev"
);
