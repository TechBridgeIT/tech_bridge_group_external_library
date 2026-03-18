// src/auth/utils.ts
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "./types";

export function extractBearer(req: Request): string {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new Error("Missing Authorization header");
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
        throw new Error("Invalid Authorization header format");
    }

    return token;
}

export function tryExtractBearer(req: Request): string | null {
    const authHeader = req.headers.authorization;

    if (!authHeader) return null;

    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token) return null;

    return token;
}

export function verifyAccessToken(token: string, secret: string): JwtPayload {
    return jwt.verify(token, secret) as JwtPayload;
}