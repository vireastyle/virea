import { Request, Response, NextFunction } from "express";
import * as avatarsService from "../services/avatars.service";
import { AppError } from "../middleware/errorHandler";

export async function getAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user!.role !== "user") throw new AppError(403, "Vendors do not have avatars", "FORBIDDEN");
    const data = await avatarsService.getAvatar(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function upsertAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user!.role !== "user") throw new AppError(403, "Vendors do not have avatars", "FORBIDDEN");
    const data = await avatarsService.upsertAvatar(req.user!.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
