import { Router } from "express";
import { z } from "zod";
import { userGuard } from "../middleware/authGuard";
import { validate } from "../middleware/validate";
import * as ctrl from "../controllers/outfits.controller";

const router = Router();

const saveSchema = z.object({
  name: z.string().min(1).max(120),
  imageUrl: z.string().url(),
  items: z.array(z.string()).min(1),
});

router.get("/", userGuard, ctrl.getOutfits);
router.post("/", userGuard, validate(saveSchema), ctrl.saveOutfit);
router.delete("/:outfitId", userGuard, ctrl.deleteOutfit);

export default router;
