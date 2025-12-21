import { compare, genSalt, hash } from 'bcrypt';
import { HashAdapter } from '../domain/interfaces/hash.adapter';

export class BcryptAdapter implements HashAdapter {
    async hash(password: string): Promise<string> {
        const salt = await genSalt(10);
        return await hash(password, salt);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return await compare(password, hash);
    }
}

export const bcryptAdapter = new BcryptAdapter();