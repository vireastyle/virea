import { Request, Response, NextFunction } from "express";
import * as usersService from "../services/users.service";

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id, role } = req.user!;
    const data = await usersService.getMe(id, role);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id, role } = req.user!;
    const data = await usersService.updateMe(id, role, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
