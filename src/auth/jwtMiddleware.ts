import { Request, RequestHandler } from "express";
import { JwtPayload } from "./types";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function getJwtKey(): string {
    const key = process.env.JWT_SECRET;
    if (!key) throw new Error("Missing JWT_SECRET");
    return key;
}



// TR
function extractBearer(req: Request): string {
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

function verifyAccessToken(token: string, secret: string): JwtPayload {
    return jwt.verify(token, secret) as JwtPayload;
}

export function jwtAuthMiddleware(): RequestHandler {
    return (req, res, next) => {
        // ✅ bypass preflight
        if (req.method === "OPTIONS") {
            return next();
        }

        try {
            const token = extractBearer(req);

            if (!getJwtKey()) {
                throw new Error("Missing JWT_SECRET");
            }

            const payload = verifyAccessToken(token, getJwtKey());

            req.user = {
                id: payload.sub,
                role: payload.role,
                emailVer: payload.emailVer,
            };

            req.token = token;

            next();
        } catch (err) {
            console.log("JWT ERROR:", err);
            res.status(401).json({ message: "Unauthorized" });
        }
    };
}