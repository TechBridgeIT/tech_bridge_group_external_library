import { Request, Response, NextFunction } from "express";
import { RateLimitOptions } from "./types";
import { getRedisClient } from "./redisClient";

export function slidingWindowRateLimiter(options: RateLimitOptions) {
    const { limit, windowMs, keyGenerator } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        const redis = getRedisClient();

        try {
            // STEP 1 — identificazione utente
            const key = keyGenerator ? keyGenerator(req) : req.ip;

            // STEP 2 — tempo corrente
            const now = Date.now();

            // STEP 3 — inizio finestra corrente
            const windowStart =
                Math.floor(now / windowMs) * windowMs;

            // STEP 4 — chiavi Redis
            const currentKey = `rate:${key}:${windowStart}`;
            const prevKey = `rate:${key}:${windowStart - windowMs}`;

            // STEP 5 — recupero dati (pipeline)
            const results = await redis
                .multi()
                .get(currentKey)
                .get(prevKey)
                .exec();

            const current = Number(results?.[0][1]) || 0;
            const previous = Number(results?.[1][1]) || 0;

            // STEP 6 — calcolo peso finestra precedente
            const elapsed = now - windowStart;
            const weight = (windowMs - elapsed) / windowMs;

            // STEP 7 — sliding window
            const estimated = current + previous * weight;

            // STEP 8 — check limite
            if (estimated >= limit) {
                return res.status(429).json({
                    message: "Too many requests",
                });
            }

            // STEP 9 — incremento contatore
            await redis
                .multi()
                .incr(currentKey)
                .pexpire(currentKey, windowMs * 2)
                .exec();

            // STEP 10 — headers (bonus ma importante)
            res.setHeader("X-RateLimit-Limit", limit);
            res.setHeader(
                "X-RateLimit-Remaining",
                Math.max(0, Math.floor(limit - estimated))
            );

            next();
        } catch (err) {
            console.error("Rate limiter error:", err);

            // fail-open
            next();
        }
    };
}