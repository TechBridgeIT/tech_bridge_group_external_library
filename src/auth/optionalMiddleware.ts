import { RequestHandler } from "express";
import { verifyAccessToken, tryExtractBearer } from "./utils";
import { AuthUser } from "./types";

export function createOptionalJwtMiddleware(secret: string): RequestHandler {
    return (req, _res, next) => {
        try {
            const token = tryExtractBearer(req);
            if (!token) return next();

            const payload = verifyAccessToken(token, secret);

            const user: AuthUser = {
                id: payload.sub,
                role: payload.role,
                emailVer: payload.emailVer,
            };

            req.user = user;
            req.token = token;
        } catch {
            // token invalido → ignorato
        }

        next();
    };
}