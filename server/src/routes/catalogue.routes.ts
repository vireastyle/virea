import { Router } from "express";
import * as ctrl from "../controllers/catalogue.controller";

const router = Router();

// Public — no auth required for browsing
router.get("/", ctrl.listProducts);
router.get("/:id", ctrl.getProduct);

export default router;
