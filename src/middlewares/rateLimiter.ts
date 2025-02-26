import CustomError from "config/custom-error.js";
import { getClientIP } from "utils/getClientIP.js";
import { NextFunction, Request, Response } from "express";
import { redis } from "config/redis.js";
import STATUS from "constants/status.js";

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ip = getClientIP(req);

    const requests = await redis.incr(ip as string);

    if (requests === 1) {
      redis.expire(ip as string, 1);
      return next();
    }

    if (requests > 5) {
      redis.expire(ip as string, 10); // Cooldown for 10 seconds
      throw new CustomError(
        "Too many requests, wait 10 seconds and try again",
        STATUS.TOO_MANY_REQUESTS
      );
    }

    next();
  } catch (err) {
    next(err);
  }
}
