import { RequestHandler } from "express";
import { AuthUser } from "./types";

export function requireRole(...allowedRoles: AuthUser["role"][]): RequestHandler {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
}