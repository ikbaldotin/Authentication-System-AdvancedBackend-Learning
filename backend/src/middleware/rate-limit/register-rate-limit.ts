import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../../lib/redis";

export const registerRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // for testing
  max: 30, // for testing
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      return redis.call(args[0], ...args.slice(1)) as Promise<any>;
    },
  }),
  handler: (_, res) => {
    res.status(429).json({
      success: false,
      message: "Register rate limit,Too many request,pleaes try again later",
    });
  },
  keyGenerator: (req) => {
    return ipKeyGenerator(req.ip as string);
  },
});
