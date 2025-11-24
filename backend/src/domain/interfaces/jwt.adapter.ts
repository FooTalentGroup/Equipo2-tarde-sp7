export interface JwtAdapter {
    generateToken(payload: { [key: string]: any }, duration?: string): Promise<string>;
    verifyToken(token: string): Promise<{ [key: string]: any }>;
    validateToken(token: string): Promise<{ [key: string]: any } | null>;
}

