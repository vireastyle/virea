import { Router } from "express";
import { z } from "zod";
import { userGuard } from "../middleware/authGuard";
import { validate } from "../middleware/validate";
import * as ctrl from "../controllers/bag.controller";

const router = Router();

const addSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  size: z.string().min(1),
  colour: z.string().min(1),
});

const updateSchema = z.object({
  quantity: z.number().int().min(0), // 0 triggers deletion in service
});

router.get("/", userGuard, ctrl.getBag);
router.post("/", userGuard, validate(addSchema), ctrl.addToBag);
router.patch("/:itemId", userGuard, validate(updateSchema), ctrl.updateBagItem);
router.delete("/clear", userGuard, ctrl.clearBag);
router.delete("/:itemId", userGuard, ctrl.removeFromBag);

export default router;
