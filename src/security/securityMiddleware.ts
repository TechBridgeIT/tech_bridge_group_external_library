import { Request, Response, NextFunction } from "express";
import helmet from "helmet";

/**
 * Middleware di sicurezza da usare in tutti i microservizi.
 * Applica CSP, HSTS, XSS protection, frame-guard, referrer policy e permissions.
 */
export const securityMiddleware = [
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'"],
                "style-src": ["'self'"],
                "img-src": ["'self'", "data:"],
                "object-src": ["'none'"],
                "frame-ancestors": ["'none'"],
                "base-uri": ["'self'"]
            },
        },
        crossOriginEmbedderPolicy: false, // evita conflitti con CSP
    }),

    // X-XSS-Protection (legacy, per browser vecchi)
    (req: Request, res: Response, next: NextFunction) => {
        res.setHeader("X-XSS-Protection", "1; mode=block");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Referrer-Policy", "no-referrer");
        res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
        res.setHeader("X-Frame-Options", "DENY");
        next();
    }
];