import type { JwtPayload } from './jwt-payload';

export interface JwtAdapter {
	generateToken(payload: JwtPayload, duration?: string): Promise<string>;
	verifyToken(token: string): Promise<JwtPayload>;
	validateToken(token: string): Promise<JwtPayload | null>;
}

