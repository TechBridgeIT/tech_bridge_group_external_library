import { Request, RequestHandler } from "express";
import { JwtPayload, AuthUser } from "./types";
import * as jwt from "jsonwebtoken";


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

export function JwtAuthMiddleware(secret: string): RequestHandler {
    return (req, res, next) => {
        try {
            const token = extractBearer(req);
            const payload = verifyAccessToken(token, secret);

            const user: AuthUser = {
                id: payload.sub,
                role: payload.role,
                emailVer: payload.emailVer,
            };

            req.user = user;
            req.token = token;

            next();
        } catch {
            res.status(401).json({ message: "Unauthorized" });
        }
    };
}