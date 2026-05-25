import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { authLimiter } from "../middleware/rateLimit";
import * as ctrl from "../controllers/auth.controller";

const router = Router();

// ─── Schemas ──────────────────────────────────────────────

const registerUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerVendorSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  businessName: z.string().min(2).max(120),
  bankName: z.string().min(2).max(100),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
  accountName: z.string().min(2).max(120),
  categories: z
    .array(z.enum(["DRESS", "TOP", "OUTERWEAR", "BAG", "SHOES"]))
    .min(1, "Select at least one category"),
});

// ─── User routes ──────────────────────────────────────────

router.post(
  "/register",
  authLimiter,
  validate(registerUserSchema),
  ctrl.registerUser
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  ctrl.loginUser
);

// ─── Vendor routes ────────────────────────────────────────

router.post(
  "/vendor/register",
  authLimiter,
  validate(registerVendorSchema),
  ctrl.registerVendor
);

router.post(
  "/vendor/login",
  authLimiter,
  validate(loginSchema),
  ctrl.loginVendor
);

// ─── Shared ───────────────────────────────────────────────

// No auth limiter on refresh — the DB lookup is the protection here
router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);

export default router;
