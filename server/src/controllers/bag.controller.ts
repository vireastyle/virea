import { Request, Response, NextFunction } from "express";
import * as bagService from "../services/bag.service";

export async function getBag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await bagService.getBag(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function addToBag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await bagService.addToBag(req.user!.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateBagItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const itemId = req.params["itemId"] as string;
    const data = await bagService.updateBagItem(req.user!.id, itemId, req.body.quantity as number);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function removeFromBag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const itemId = req.params["itemId"] as string;
    await bagService.removeFromBag(req.user!.id, itemId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function clearBag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await bagService.clearBag(req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
