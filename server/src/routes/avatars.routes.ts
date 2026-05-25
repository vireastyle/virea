import { Router } from "express";
import { z } from "zod";
import { userGuard } from "../middleware/authGuard";
import { validate } from "../middleware/validate";
import * as ctrl from "../controllers/avatars.controller";

const router = Router();

const avatarSchema = z.object({
  gender: z.string().min(1),
  bodyShape: z.string().min(1),
  skinTone: z.string().min(1),
  hairStyle: z.string().min(1),
  hairColour: z.string().min(1),
  height: z.string().min(1),
  size: z.string().min(1),
  photoUrl: z.string().url().optional(),
});

router.get("/me", userGuard, ctrl.getAvatar);
router.put("/me", userGuard, validate(avatarSchema), ctrl.upsertAvatar);

export default router;
