import { Request, Response } from "express";

export function notFound(req: Request, res: Response) {
  res.status(404).json({
    error: `${req.url} endpoint doesn't exists :/`,
  });
}
