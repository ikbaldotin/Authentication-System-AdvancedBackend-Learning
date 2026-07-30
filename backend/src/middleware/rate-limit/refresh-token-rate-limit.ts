import rateLimit, { ipKeyGenerator } from "express-rate-limit";

import RedisStore from "rate-limit-redis";
import redis from "../../lib/redis.js";
export const refreshRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // for testing
  max: 30, // for testing
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => {
      return redis.call(args[0], ...args.slice(1)) as Promise<any>;
    },
    prefix: "refreshtoken",
  }),
  handler: async (_, res) => {
    return res.status(429).json({
      success: false,
      message: "login rate limit, Too many request,pleaes try again later",
    });
  },
  keyGenerator: (req) => {
    return ipKeyGenerator(req.ip as string);
  },
});
