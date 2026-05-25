import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import avatarsRoutes from "./avatars.routes";
import catalogueRoutes from "./catalogue.routes";
import wishlistRoutes from "./wishlist.routes";
import bagRoutes from "./bag.routes";
import outfitsRoutes from "./outfits.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/avatars", avatarsRoutes);
router.use("/catalogue", catalogueRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/bag", bagRoutes);
router.use("/outfits", outfitsRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

export default router;
