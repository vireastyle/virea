import { Request, Response, NextFunction } from "express";
import * as catalogueService from "../services/catalogue.service";

export async function listProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Flatten query params — Express parses repeated keys as string[]; we want strings only
    const query: Record<string, string> = {};
    for (const [k, v] of Object.entries(req.query)) {
      if (typeof v === "string") query[k] = v;
      else if (Array.isArray(v) && typeof v[0] === "string") query[k] = v[0] as string;
    }
    const data = await catalogueService.listProducts(query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params["id"] as string;
    const data = await catalogueService.getProduct(id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
