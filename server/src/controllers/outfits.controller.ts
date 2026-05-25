import { Request, Response, NextFunction } from "express";
import * as outfitsService from "../services/outfits.service";

export async function getOutfits(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await outfitsService.getOutfits(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function saveOutfit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await outfitsService.saveOutfit(req.user!.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteOutfit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const outfitId = req.params["outfitId"] as string;
    await outfitsService.deleteOutfit(req.user!.id, outfitId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
