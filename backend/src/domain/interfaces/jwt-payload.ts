
export interface JwtPayload {
	id: string;
	email: string;
	role?: string | null;
	isAdmin?: boolean;
	jti?: string;
	iat?: number;
	exp?: number;
}
