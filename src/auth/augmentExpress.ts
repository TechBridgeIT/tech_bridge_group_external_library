import { AuthUser } from "./types";

declare module "express" {
    interface Request {
        user?: AuthUser;
        token?: string;
    }
}

export {};