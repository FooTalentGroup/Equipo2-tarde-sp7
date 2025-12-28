import { ProfileModel, RoleModel } from '../../data/postgres/models';
import { CustomError, UpdateUserDto } from '../../domain';
import { HashAdapter } from '../../domain/interfaces/hash.adapter';


export class UserServices {
    constructor(
        private readonly hashAdapter: HashAdapter
    ) {}
    
    async listUsers() {
        try {
            const users = await ProfileModel.findAll();
            
            const enrichedUsers = await Promise.all(
                users.map(async (user) => {
                    const role = user.role_id ? await RoleModel.findById(user.role_id) : null;
                    
                    return {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.phone || null,
                        active: user.active ?? true,
                        role: role ? role.name : null,
                        created_at: user.created_at
                    };
                })
            );
            
            return {
                users: enrichedUsers,
                count: enrichedUsers.length
            };
        } catch (error) {
            throw CustomError.internalServerError(`Error listing users: ${error}`);
        }
    }

    async getUserById(userId: number | string) {
        try {
            const user = await ProfileModel.findById(userId);
            if (!user) {
                throw CustomError.notFound('User not found');
            }

            const role = user.role_id ? await RoleModel.findById(user.role_id) : null;
            
            return {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone || null,
                active: user.active ?? true,
                role: role ? role.name : null,
                created_at: user.created_at
            };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting user: ${error}`);
        }
    }

 
    async updateUser(userId: number, updateUserDto: UpdateUserDto, isAdmin: boolean = false) {
        try {
            const existingUser = await ProfileModel.findById(userId);
            if (!existingUser) {
                throw CustomError.notFound('User not found');
            }

            const updateData: Record<string, unknown> = {};
            
            if (updateUserDto.first_name !== undefined) {
                updateData.first_name = updateUserDto.first_name;
            }
            if (updateUserDto.last_name !== undefined) {
                updateData.last_name = updateUserDto.last_name;
            }
            if (updateUserDto.email !== undefined) {
                const existingEmailUser = await ProfileModel.findByEmail(updateUserDto.email);
                if (existingEmailUser && existingEmailUser.id !== userId) {
                    throw CustomError.badRequest('Email is already in use');
                }
                updateData.email = updateUserDto.email;
            }
            if (updateUserDto.phone !== undefined) {
                updateData.phone = updateUserDto.phone || null;
            }
            if (updateUserDto.password !== undefined) {
                updateData.password_hash = await this.hashAdapter.hash(updateUserDto.password);
            }
            
            if (isAdmin) {
                if (updateUserDto.role !== undefined) {
                    const role = await RoleModel.findByName(updateUserDto.role);
                    if (!role || !role.id) {
                        throw CustomError.badRequest(`Role "${updateUserDto.role}" not found. Valid roles: admin, agent`);
                    }
                    updateData.role_id = role.id;
                } else if (updateUserDto.role_id !== undefined) {
                    updateData.role_id = updateUserDto.role_id;
                }
                
                if (updateUserDto.active !== undefined) {
                    updateData.active = updateUserDto.active;
                }
            } else {
                if (updateUserDto.role !== undefined || updateUserDto.role_id !== undefined || updateUserDto.active !== undefined) {
                    throw CustomError.badRequest('Only admin can change role or active status');
                }
            }

            const updatedUser = await ProfileModel.update(userId, updateData);
            if (!updatedUser) {
                throw CustomError.internalServerError('Failed to update user');
            }

            const role = updatedUser.role_id ? await RoleModel.findById(updatedUser.role_id) : null;
            
            return {
                id: updatedUser.id,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                email: updatedUser.email,
                phone: updatedUser.phone || null,
                active: updatedUser.active ?? true,
                role: role ? role.name : null,
                created_at: updatedUser.created_at
            };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating user: ${error}`);
        }
    }

    async deleteUser(userId: number) {
        try {
            const user = await ProfileModel.findById(userId);
            if (!user) {
                throw CustomError.notFound('User not found');
            }

            const deleted = await ProfileModel.delete(userId);
            if (!deleted) {
                throw CustomError.internalServerError('Failed to delete user');
            }

            return { message: 'User deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting user: ${error}`);
        }
    }
}

