import CustomError from "config/custom-error.js";
import { getClientIP } from "utils/getClientIP.js";
import { NextFunction, Request, Response } from "express";
import { redis } from "config/redis.js";
import STATUS from "constants/status.js";

// I chose to implement rate limiter from strach because i want to show that I know how things work under the hood and also that I'm careful about MEMORY LEAK !
// In this example, if you ask chatgpt or someone else who is not much experienced  to write this function, they will send you an solution with MEMORY LEAK
// Instead of storing data for each user in memory, we are using REDIS (any cloud storage).

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
