import { Request, Response } from 'express';
import { CustomError, UpdateUserDto } from '../../domain';
import { UserServices } from '../services/user.services';

export class UserController {
    constructor(
        private readonly userServices: UserServices
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }
        console.error('User Controller Error:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }

    /**
     * Lists all users
     */
    listUsers = async (req: Request, res: Response) => {
        try {
            const result = await this.userServices.listUsers();
            return res.json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Gets a single user by ID
     */
    getUserById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    message: 'User ID is required'
                });
            }

            const userId = Number(id);
            if (isNaN(userId)) {
                return res.status(400).json({
                    message: 'Invalid user ID'
                });
            }

            const user = await this.userServices.getUserById(userId);
            return res.json({ user });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Updates a user
     * Admin can update any user, users can only update themselves
     */
    updateUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = (req as any).user;
            
            if (!id) {
                return res.status(400).json({
                    message: 'User ID is required'
                });
            }

            const userId = Number(id);
            if (isNaN(userId)) {
                return res.status(400).json({
                    message: 'Invalid user ID'
                });
            }

            // Validate and create DTO
            const [error, updateUserDto] = UpdateUserDto.create(req.body);
            if (error || !updateUserDto) {
                return res.status(400).json({
                    message: error || 'Invalid user data'
                });
            }

            // Check if user is admin
            const isAdmin = user.isAdmin === true;

            // Update user
            const updatedUser = await this.userServices.updateUser(userId, updateUserDto, isAdmin);
            return res.json({
                message: 'User updated successfully',
                user: updatedUser
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Soft deletes a user (Admin only)
     */
    deleteUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    message: 'User ID is required'
                });
            }

            const userId = Number(id);
            if (isNaN(userId)) {
                return res.status(400).json({
                    message: 'Invalid user ID'
                });
            }

            // Delete user
            const result = await this.userServices.deleteUser(userId);
            return res.json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    }
}

