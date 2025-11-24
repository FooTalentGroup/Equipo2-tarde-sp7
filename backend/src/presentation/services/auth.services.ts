import { ProfileModel, RoleModel } from "../../data/postgres/models";
import { CustomError, JwtAdapter, LoginProfileDto, ProfileEntity, RegisterProfileDto } from "../../domain";
import { HashAdapter } from "../../domain/interfaces/hash.adapter";



export class AuthServices {

    // DI
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
            // Hash password before creating profile
            const hashedPassword = await this.hashAdapter.hash(registerProfileDto.password);
            
            // Assign default role if none is specified
            let roleId = registerProfileDto.role_id;
            if (!roleId) {
                const defaultRole = await RoleModel.findByTitle('agent');
                if (!defaultRole) {
                    throw CustomError.internalServerError('Default role "agent" not found. Run: npm run db:seed-roles');
                }
                roleId = defaultRole.id!;
            }
            
            // Create profile in database (this generates the ID)
            const profile = await ProfileModel.create({
                first_name: registerProfileDto.first_name,
                last_name: registerProfileDto.last_name,
                email: registerProfileDto.email,
                password: hashedPassword,
                phone: registerProfileDto.phone,
                role_id: roleId,
                whatsapp_number: registerProfileDto.whatsapp_number
            });

            // Create entity from created profile (which already has the ID)
            const profileEntity = ProfileEntity.fromObject(profile);
            
            // Generate JWT token
            const token = await this.jwtAdapter.generateToken({ id: profileEntity.id, email: profileEntity.email });
            
            // Return public object without password and token
            return {
                user: profileEntity.toPublicObject(),
                token
            };
        } catch (error) {
            throw CustomError.internalServerError(`Error registering profile: ${error}`);
        }

    }

    public async loginProfile(loginProfileDto: LoginProfileDto) {
        // Find profile by email
        const profile = await ProfileModel.findByEmail(loginProfileDto.email);
        if (!profile) {
            throw CustomError.badRequest('Invalid credentials');
        }

        // Compare password using adapter
        const isMatch = await this.hashAdapter.compare(loginProfileDto.password, profile.password);
        if (!isMatch) {
            throw CustomError.badRequest('Invalid credentials');
        }

        // Create entity from profile
        const profileEntity = ProfileEntity.fromObject(profile);
        
        // Generate JWT token
        const token = await this.jwtAdapter.generateToken({ id: profileEntity.id, email: profileEntity.email });
        
        // Return user without password and token
        return {
            user: profileEntity.toPublicObject(),
            token
        };
    }

    public async getProfile(userId: string) {
        try {
            const profile = await ProfileModel.findById(userId);
            if (!profile) {
                throw CustomError.notFound('Profile not found');
            }

            const profileEntity = ProfileEntity.fromObject(profile);
            return profileEntity.toPublicObject();
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting profile: ${error}`);
        }
    }
}