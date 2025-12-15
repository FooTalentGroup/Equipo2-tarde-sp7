import { ProfileModel, RoleModel } from '../../data/postgres/models';
import { CustomError, UpdateUserDto } from '../../domain';
import { HashAdapter } from '../../domain/interfaces/hash.adapter';

/**
 * Service for handling user operations
 */
export class UserServices {
    constructor(
        private readonly hashAdapter: HashAdapter
    ) {}
    
    /**
     * Lists all users with their roles
     */
    async listUsers() {
        try {
            const users = await ProfileModel.findAll();
            
            // Enrich with role information
            const enrichedUsers = await Promise.all(
                users.map(async (user) => {
                    const role = user.role_id ? await RoleModel.findById(user.role_id) : null;
                    
                    // Return user without password_hash
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

    /**
     * Gets a single user by ID with role information
     */
    async getUserById(userId: number | string) {
        try {
            const user = await ProfileModel.findById(userId);
            if (!user) {
                throw CustomError.notFound('User not found');
            }

            // Get role information
            const role = user.role_id ? await RoleModel.findById(user.role_id) : null;
            
            // Return user without password_hash
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

    /**
     * Updates a user
     * Only admin can change role_id and active
     */
    async updateUser(userId: number, updateUserDto: UpdateUserDto, isAdmin: boolean = false) {
        try {
            // Check if user exists
            const existingUser = await ProfileModel.findById(userId);
            if (!existingUser) {
                throw CustomError.notFound('User not found');
            }

            // Prepare update data
            const updateData: Record<string, unknown> = {};
            
            if (updateUserDto.first_name !== undefined) {
                updateData.first_name = updateUserDto.first_name;
            }
            if (updateUserDto.last_name !== undefined) {
                updateData.last_name = updateUserDto.last_name;
            }
            if (updateUserDto.email !== undefined) {
                // Check if email is already taken by another user
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
                // Hash password before updating
                updateData.password_hash = await this.hashAdapter.hash(updateUserDto.password);
            }
            
            // Only admin can change role and active
            if (isAdmin) {
                // Resolver rol por nombre (tiene prioridad) o por ID
                if (updateUserDto.role !== undefined) {
                    // Buscar rol por nombre
                    const role = await RoleModel.findByName(updateUserDto.role);
                    if (!role || !role.id) {
                        throw CustomError.badRequest(`Role "${updateUserDto.role}" not found. Valid roles: admin, agent`);
                    }
                    updateData.role_id = role.id;
                } else if (updateUserDto.role_id !== undefined) {
                    // Compatibilidad con role_id (deprecated)
                    updateData.role_id = updateUserDto.role_id;
                }
                
                if (updateUserDto.active !== undefined) {
                    updateData.active = updateUserDto.active;
                }
            } else {
                // Non-admin users cannot change role or active
                if (updateUserDto.role !== undefined || updateUserDto.role_id !== undefined || updateUserDto.active !== undefined) {
                    throw CustomError.badRequest('Only admin can change role or active status');
                }
            }

            // Update user
            const updatedUser = await ProfileModel.update(userId, updateData);
            if (!updatedUser) {
                throw CustomError.internalServerError('Failed to update user');
            }

            // Get role information
            const role = updatedUser.role_id ? await RoleModel.findById(updatedUser.role_id) : null;
            
            // Return user without password_hash
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

    /**
     * Soft delete a user (Admin only)
     */
    async deleteUser(userId: number) {
        try {
            // Check if user exists
            const user = await ProfileModel.findById(userId);
            if (!user) {
                throw CustomError.notFound('User not found');
            }

            // Perform soft delete
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

