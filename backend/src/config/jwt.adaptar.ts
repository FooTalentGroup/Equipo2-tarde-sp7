import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { envs } from "./envs";
import { JwtAdapter } from '../domain/interfaces/jwt.adapter';
import type { JwtPayload } from '../domain/interfaces/jwt-payload';


const secret = envs.JWT_SECRET as string;

export class JwtAdapterImpl implements JwtAdapter {
    async generateToken(payload: JwtPayload, duration: string = '24h'): Promise<string> {
        return new Promise((resolve, reject) => {
            // Generate unique JWT ID for blacklist tracking
            const jti = uuidv4();
            
            // @ts-ignore - jsonwebtoken types issue with expiresIn
            jwt.sign(
                { 
                    ...payload,
                    jti  // Add unique identifier for token revocation
                },
                secret,
                { expiresIn: duration },
                (err, token) => {
                    if (err) reject(err);
                    else resolve(token!);
                }
            );
        });
    }

    async verifyToken(token: string): Promise<JwtPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                secret,
                (err, decoded) => {
                    if (err) reject(err);
                    else resolve(decoded as JwtPayload);
                }
            );
        });
    }

    async validateToken(token: string): Promise<JwtPayload | null> {
        try {
            const decoded = await this.verifyToken(token);
            return decoded;
        } catch (error) {
            return null;
        }
    }
}

// Export instance for convenience
export const jwtAdapter = new JwtAdapterImpl(); // singleton pattern