import { Router } from "express";
import { z } from "zod";
import { userGuard } from "../middleware/authGuard";
import { validate } from "../middleware/validate";
import * as ctrl from "../controllers/wishlist.controller";

const router = Router();

const addSchema = z.object({ productId: z.string().min(1) });

router.get("/", userGuard, ctrl.getWishlist);
router.post("/", userGuard, validate(addSchema), ctrl.addToWishlist);
router.delete("/:productId", userGuard, ctrl.removeFromWishlist);

export default router;
