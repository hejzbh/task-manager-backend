import { Request } from "express";

export const getClientIP = (req: Request) =>
  req.headers["x-forwarded-for"]
    ?.toString()
    ?.split(",")
    .map((ip) => ip.trim())[0] ||
  req.socket.remoteAddress ||
  req.connection?.remoteAddress ||
  req.ip;
