import { regularExps } from "../../../config";

export class LoginProfileDto {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ){}

    static create( object: { [key: string]: any }): [string?, LoginProfileDto?] {
        const { email, password } = object;
        
        if (!email || email.trim().length === 0) {
            return ['Email is required', undefined];
        }
        if (!password || password.trim().length === 0) {
            return ['Password is required', undefined];
        }
        
        if (!regularExps.email.test(email.trim())) {
            return ['Email format is invalid', undefined];
        }
        
        if (password.length < 6) {
            return ['Password must be at least 6 characters', undefined];
        }
        if (password.length > 100) {
            return ['Password must be less than 100 characters', undefined];
        }

        return [
            undefined, 
            new LoginProfileDto(
                email.trim().toLowerCase(),
                password
            )
        ];
    }
}

