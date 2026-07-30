import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../../lib/redis";

export const globalRateLimiter = rateLimit({
  windowMs: 5 * 10 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      return redis.call(args[0], ...args.slice(1)) as Promise<any>;
    },
    prefix: "global",
  }),
  handler: (_, res) => {
    res.status(429).json({
      success: false,
      message: "global rate limit,Too many request,pleaes try again later",
    });
  },
});
