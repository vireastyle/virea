import { Request, Response, NextFunction } from "express";
import * as wishlistService from "../services/wishlist.service";

export async function getWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await wishlistService.getWishlist(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function addToWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await wishlistService.addToWishlist(req.user!.id, req.body.productId as string);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function removeFromWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId = req.params["productId"] as string;
    await wishlistService.removeFromWishlist(req.user!.id, productId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
