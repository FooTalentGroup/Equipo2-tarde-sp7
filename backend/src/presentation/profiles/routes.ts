import { Router } from 'express';
import { ProfileController } from './controller';
import { ProfileServices } from '../services/profile.services';
import { bcryptAdapter, jwtAdapter } from '../../config';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

export class ProfileRoutes {
    static get routes(): Router {
        const router = Router();
        const profileServices = new ProfileServices(bcryptAdapter);
        const controller = new ProfileController(profileServices);
        const authMiddleware = new AuthMiddleware(jwtAdapter);

        // Rutas protegidas - requieren autenticación
        router.post('/', authMiddleware.authenticate, RoleMiddleware.requireAdmin(), controller.createProfile);
        router.get('/', authMiddleware.authenticate, controller.getAllProfiles);
        router.get('/:id', authMiddleware.authenticate, controller.getProfile);
        router.put('/:id', authMiddleware.authenticate, controller.updateProfile);
        router.delete('/:id', authMiddleware.authenticate, RoleMiddleware.requireAdmin(), controller.deleteProfile);

        return router;
    }
}

