import { RequestHandler } from "express";
import { verifyAccessToken, tryExtractBearer } from "./utils";
import { AuthUser } from "./types";
import dotenv from "dotenv";

dotenv.config();

let jwt_key = process.env.JWT_SECRET

export function optionalJwtMiddleware(): RequestHandler {
    return (req, _res, next) => {
        try {
            const token = tryExtractBearer(req);
            if (!token) return next();
            if(!jwt_key) {
                throw new Error("Missing JWT_SECRET");
            }

            const payload = verifyAccessToken(token, jwt_key);

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