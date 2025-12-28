import { JwtPayload } from '../../domain/interfaces/jwt-payload';

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export {};
