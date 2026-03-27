import Redis from "ioredis";

let redisClient: Redis | null = null;

export function setRedisClient(client: Redis) {
    redisClient = client;
}

export function getRedisClient(): Redis {
    if (!redisClient) {
        throw new Error(
            "Redis client not set. Call setRedisClient() before using rate limiter."
        );
    }
    return redisClient;
}