import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../../lib/redis";

export const refreshRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => {
      return redis.call(args[0], ...args.slice(1)) as Promise<any>;
    },
    prefix:"refreshToken"
  }),
  handler: (_, res) => {
    res.status(429).json({
      success: false,
      message: "refresh rate limit,Too many request,pleaes try again later",
    }),
    
  },
  keyGenerator: (req) => {
    return ipKeyGenerator(req.ip as string);
  },
});
