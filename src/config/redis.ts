import { createClient } from "redis";

export const redis = createClient({
  username: "default",
  password: process.env.REDIS_PW,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redis.on("error", (err) => console.log("Redis Client Error", err));
redis.connect();
