import STATUS from "constants/status.js";
import { NextFunction, Request, Response } from "express";
import CustomError from "config/custom-error.js";

export function handleError(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.status || STATUS.INTERNAL_SERVER_ERROR).json({
    error: err.message,
    success: false,
    data: null,
  });
}
