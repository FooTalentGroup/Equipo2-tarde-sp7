import { ProfileModel, RoleModel } from "../../data/postgres/models";
import { CustomError, JwtAdapter, LoginProfileDto, ProfileEntity, RegisterProfileDto } from "../../domain";
import { HashAdapter } from "../../domain/interfaces/hash.adapter";



export class AuthServices {

    constructor(
        private readonly hashAdapter: HashAdapter,
        private readonly jwtAdapter: JwtAdapter
    ){}

    public async registerProfile(registerProfileDto: RegisterProfileDto) {
        const existProfile = await ProfileModel.findByEmail(registerProfileDto.email);
        if (existProfile) {
            throw CustomError.badRequest('Profile already exists');
        }

        try {
            const hashedPassword = await this.hashAdapter.hash(registerProfileDto.password);
            
            let roleId: number = registerProfileDto.role_id || 0;
            if (!roleId) {
                const defaultRole = await RoleModel.findByName('agent');
                if (!defaultRole || !defaultRole.id) {
                    const adminRole = await RoleModel.findByName('admin');
                    if (!adminRole || !adminRole.id) {
                        throw CustomError.internalServerError('Default role "agent" or "admin" not found. Run: npm run db:seed-roles');
                    }
                    roleId = adminRole.id as number;
                } else {
                    roleId = defaultRole.id as number;
                }
            }
            
            const profile = await ProfileModel.create({
                first_name: registerProfileDto.first_name,
                last_name: registerProfileDto.last_name,
                email: registerProfileDto.email,
                password_hash: hashedPassword,
                phone: registerProfileDto.phone,
                role_id: roleId
            });

            const profileEntity = ProfileEntity.fromObject(profile);
            const role = await RoleModel.findById(profileEntity.role_id);
            
            const token = await this.jwtAdapter.generateToken({ 
                id: profileEntity.id.toString(), 
                email: profileEntity.email,
                role: role?.name || 'agent'
            });
            
            const publicUser = profileEntity.toPublicObject();
            return {
                user: {
                    ...publicUser,
                    role: role?.name || null,
                    role_id: undefined // Remove role_id from response
                },
                token
            };
        } catch (error) {
            throw CustomError.internalServerError(`Error registering profile: ${error}`);
        }

    }

    public async loginProfile(loginProfileDto: LoginProfileDto) {
        const profile = await ProfileModel.findByEmailWithPassword(loginProfileDto.email);
        if (!profile) {
            throw CustomError.badRequest('Invalid credentials');
        }

        const isMatch = await this.hashAdapter.compare(loginProfileDto.password, profile.password_hash);
        if (!isMatch) {
            throw CustomError.badRequest('Invalid credentials');
        }

        if (!profile.active) {
            throw CustomError.forbidden('User account is disabled. Please contact the administrator.');
        }

        const profileEntity = ProfileEntity.fromObject(profile);
        const role = await RoleModel.findById(profileEntity.role_id);
        
        const token = await this.jwtAdapter.generateToken({ 
            id: profileEntity.id.toString(), 
            email: profileEntity.email,
            role: role?.name || 'agent'
        });
        
        const publicUser = profileEntity.toPublicObject();
        return {
            user: {
                ...publicUser,
                role: role?.name || null,
                role_id: undefined // Remove role_id from response
            },
            token
        };
    }

    public async getProfile(userId: string | number) {
        try {
            const profile = await ProfileModel.findById(userId);
            if (!profile) {
                throw CustomError.notFound('Profile not found');
            }

            const profileEntity = ProfileEntity.fromObject(profile);
            const role = await RoleModel.findById(profileEntity.role_id);
            
            const publicUser = profileEntity.toPublicObject();
            return {
                ...publicUser,
                role: role?.name || null,
                role_id: undefined // Remove role_id from response
            };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting profile: ${error}`);
        }
    }
}