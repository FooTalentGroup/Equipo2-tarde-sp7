import { Request, Response, NextFunction } from 'express';
export class CorsMiddleware {
    static configure(allowedOrigins: string[] = ['*']) {
        return (req: Request, res: Response, next: NextFunction) => {
            const origin = req.headers.origin;
            
            if (allowedOrigins.includes('*')) {
                if (origin) {
                    res.header('Access-Control-Allow-Origin', origin);
                    res.header('Access-Control-Allow-Credentials', 'true');
                } else {
                    res.header('Access-Control-Allow-Origin', '*');
                }
            } else if (origin && allowedOrigins.includes(origin)) {
                res.header('Access-Control-Allow-Origin', origin);
                res.header('Access-Control-Allow-Credentials', 'true');
            }
            
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            
            if (req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }
            
            next();
        };
    }
}

