import { ProfileModel, RoleModel } from "../../data/postgres/models";
import { ProfileEntity, CreateProfileDto, CustomError, UpdateProfileDto, HashAdapter } from "../../domain";

export class ProfileServices {
    constructor(
        private readonly hashAdapter: HashAdapter
    ){}

    public async createProfile(createProfileDto: CreateProfileDto) {
        try {
            // Verificar que el email no existe
            const existingProfile = await ProfileModel.findByEmail(createProfileDto.email);
            if (existingProfile) {
                throw CustomError.conflict('Profile with this email already exists');
            }
            
            // Verificar que el rol existe (si se proporciona)
            if (createProfileDto.role_id) {
                const role = await RoleModel.findById(createProfileDto.role_id);
                if (!role) {
                    throw CustomError.notFound('Role not found');
                }
            }
            
            // Hash password
            const hashedPassword = await this.hashAdapter.hash(createProfileDto.password);
            
            // Crear perfil
            const profile = await ProfileModel.create({
                first_name: createProfileDto.first_name,
                last_name: createProfileDto.last_name,
                email: createProfileDto.email,
                password: hashedPassword,
                phone: createProfileDto.phone,
                role_id: createProfileDto.role_id,
                whatsapp_number: createProfileDto.whatsapp_number
            });

            const profileEntity = ProfileEntity.fromObject(profile);
            return profileEntity.toPublicObject();
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating profile: ${error}`);
        }
    }

    public async getAllProfiles() {
        try {
            const profiles = await ProfileModel.findAll();
            return profiles.map(profile => {
                const entity = ProfileEntity.fromObject(profile);
                return entity.toPublicObject();
            });
        } catch (error) {
            throw CustomError.internalServerError(`Error getting profiles: ${error}`);
        }
    }

    public async getProfileById(id: string) {
        try {
            const profile = await ProfileModel.findById(id);
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

    public async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
        try {
            const existing = await ProfileModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Profile not found');
            }
            
            // Verificar que el email no existe en otro perfil (si se está actualizando)
            if (updateProfileDto.email && updateProfileDto.email !== existing.email) {
                const profileWithEmail = await ProfileModel.findByEmail(updateProfileDto.email);
                if (profileWithEmail && profileWithEmail.id !== id) {
                    throw CustomError.conflict('Profile with this email already exists');
                }
            }
            
            // Verificar que el rol existe (si se está actualizando)
            if (updateProfileDto.role_id) {
                const role = await RoleModel.findById(updateProfileDto.role_id);
                if (!role) {
                    throw CustomError.notFound('Role not found');
                }
            }
            
            const updated = await ProfileModel.update(id, {
                first_name: updateProfileDto.first_name,
                last_name: updateProfileDto.last_name,
                email: updateProfileDto.email,
                phone: updateProfileDto.phone,
                role_id: updateProfileDto.role_id,
                whatsapp_number: updateProfileDto.whatsapp_number
            });
            
            if (!updated) {
                throw CustomError.notFound('Profile not found');
            }
            
            const profileEntity = ProfileEntity.fromObject(updated);
            return profileEntity.toPublicObject();
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating profile: ${error}`);
        }
    }

    public async deleteProfile(id: string) {
        try {
            const existing = await ProfileModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Profile not found');
            }
            const deleted = await ProfileModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Profile not found');
            }
            return { message: 'Profile deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting profile: ${error}`);
        }
    }
}

