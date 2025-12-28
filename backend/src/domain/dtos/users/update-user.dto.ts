import { regularExps } from "../../../config";

export class UpdateUserDto {
    constructor(
        public readonly first_name?: string,
        public readonly last_name?: string,
        public readonly email?: string,
        public readonly phone?: string,
        public readonly password?: string,
        public readonly role?: string,
        public readonly role_id?: number,
        public readonly active?: boolean,
    ) {}

    static create(object: Record<string, unknown>): [string?, UpdateUserDto?] {
        const {
            first_name,
            last_name,
            email,
            phone,
            password,
            role,
            role_id,
            active
        } = object;

        if (!first_name && !last_name && !email && !phone && !password && !role && role_id === undefined && active === undefined) {
            return ['At least one field must be provided for update', undefined];
        }
        if (email && typeof email === 'string' && email.trim().length > 0) {
            if (!regularExps.email.test(email.trim())) {
                return ['Email format is invalid', undefined];
            }
        }

        if (phone && typeof phone === 'string' && phone.trim().length > 0) {
            if (!regularExps.phone.test(phone.trim())) {
                return ['Phone format is invalid', undefined];
            }
        }

        if (password && typeof password === 'string') {
            if (password.length < 6) {
                return ['Password must be at least 6 characters', undefined];
            }
            if (password.length > 100) {
                return ['Password must be less than 100 characters', undefined];
            }
        }

        if (first_name && typeof first_name === 'string' && first_name.trim().length > 0 && first_name.trim().length < 2) {
            return ['First name must be at least 2 characters', undefined];
        }
        if (last_name && typeof last_name === 'string' && last_name.trim().length > 0 && last_name.trim().length < 2) {
            return ['Last name must be at least 2 characters', undefined];
        }

        let normalizedRole: string | undefined = undefined;
        if (role !== undefined && role !== null) {
            const roleStr = String(role).trim().toLowerCase();
            if (roleStr !== 'admin' && roleStr !== 'agent') {
                return ['Role must be "admin" or "agent"', undefined];
            }
            normalizedRole = roleStr;
        }
        
        let normalizedRoleId: number | undefined = undefined;
        if (normalizedRole === undefined && role_id !== undefined) {
            if (isNaN(Number(role_id))) {
                return ['Role ID must be a number', undefined];
            }
            normalizedRoleId = Number(role_id);
        }

        if (active !== undefined && typeof active !== 'boolean' && active !== 'true' && active !== 'false') {
            return ['Active must be a boolean', undefined];
        }

        return [
            undefined,
            new UpdateUserDto(
                (first_name as string | undefined)?.trim(),
                (last_name as string | undefined)?.trim(),
                (email as string | undefined)?.trim().toLowerCase(),
                (phone as string | undefined)?.trim(),
                password as string | undefined,
                normalizedRole,
                normalizedRoleId,
                active !== undefined ? (typeof active === 'boolean' ? active : active === 'true') : undefined
            )
        ];
    }
}


