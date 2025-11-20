


export class CustomError extends Error {

    private constructor(
        public readonly statusCode: number,
        public readonly message: string,
    ) {
        super(message);
    }

    static badRequest(message: string): CustomError {
        return new CustomError(400, message);
    }

    static unauthorized(message: string): CustomError {
        return new CustomError(401, message);
    }

    static forbidden(message: string): CustomError {
        return new CustomError(403, message);
    }

    static notFound(message: string): CustomError {
        return new CustomError(404, message);
    }

    static internalServerError(message: string): CustomError {
        return new CustomError(500, message);
    }

    static badGateway(message: string): CustomError {
        return new CustomError(502, message);
    }
    
    static serviceUnavailable(message: string): CustomError {
        return new CustomError(503, message);
    }

    static gatewayTimeout(message: string): CustomError {
        return new CustomError(504, message);
    }

    static conflict(message: string): CustomError {
        return new CustomError(409, message);
    }

    static unprocessableEntity(message: string): CustomError {
        return new CustomError(422, message);
    }

    static tooManyRequests(message: string): CustomError {
        return new CustomError(429, message);
    }

    static preconditionFailed(message: string): CustomError {
        return new CustomError(412, message);
    }
}