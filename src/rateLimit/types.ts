import { Request } from "express";

export type RateLimitOptions = {
    limit: number;
    windowMs: number;
    keyGenerator?: (req: Request) => string;
};