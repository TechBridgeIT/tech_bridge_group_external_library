// src/auth/types.ts
export interface JwtPayload {
    sub: string;
    role: "ADMIN" | "USER" | "MODERATOR";
    emailVer: boolean;
}

export interface AuthUser {
    id: string;
    role: JwtPayload["role"];
    emailVer: boolean;
}