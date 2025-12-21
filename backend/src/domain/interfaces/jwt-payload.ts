/**
 * Tipo para el payload de JWT
 * Define la estructura de datos que se almacena en el token
 */
export interface JwtPayload {
	id: string; // User ID as string (used in auth.services.ts)
	email: string;
	role?: string | null; // Role name (admin, agent) - can be null
	isAdmin?: boolean; // Flag indicating if user is admin
	jti?: string; // JWT ID for token revocation/blacklist
	iat?: number; // Issued at
	exp?: number; // Expiration time
}
