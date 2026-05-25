import { Router } from "express";
import { z } from "zod";
import { anyAuthGuard } from "../middleware/authGuard";
import { validate } from "../middleware/validate";
import * as ctrl from "../controllers/users.controller";

const router = Router();

const updateMeSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(500).optional(),
  businessName: z.string().min(2).max(120).optional(),
});

router.get("/me", anyAuthGuard, ctrl.getMe);
router.patch("/me", anyAuthGuard, validate(updateMeSchema), ctrl.updateMe);

export default router;
