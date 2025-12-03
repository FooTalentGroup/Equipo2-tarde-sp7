import { Router } from 'express';
import { PropertyController } from './controller';
import { PropertyServices } from '../services/property.services';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { UploadMiddleware } from '../middlewares/upload.middleware';
import { jwtAdapter, cloudinaryAdapter } from '../../config';

export class PropertyRoutes {
    static get routes(): Router {
        const router = Router();
        
        // Inicializar dependencias
        const propertyServices = new PropertyServices(cloudinaryAdapter);
        const controller = new PropertyController(propertyServices);
        const authMiddleware = new AuthMiddleware(jwtAdapter);

        /**
         * @swagger
         * /api/properties:
         *   post:
         *     summary: Create a new property
         *     tags: [Properties]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             required:
         *               - propertyDetails
         *               - geography
         *               - address
         *               - prices
         *             properties:
         *               propertyDetails:
         *                 type: string
         *                 description: JSON string with property details
         *               geography:
         *                 type: string
         *                 description: JSON string with {country, province, city}
         *               address:
         *                 type: string
         *                 description: JSON string with address details
         *               prices:
         *                 type: string
         *                 description: JSON string with array of prices
         *               images:
         *                 type: array
         *                 items:
         *                   type: string
         *                   format: binary
         *                 description: Property images (optional)
         *     responses:
         *       201:
         *         description: Property created successfully
         *       400:
         *         description: Bad request
         *       401:
         *         description: Unauthorized
         */
        /**
         * @swagger
         * /api/properties:
         *   get:
         *     summary: List properties with optional filters
         *     tags: [Properties]
         *     parameters:
         *       - in: query
         *         name: property_type_id
         *         schema:
         *           type: integer
         *       - in: query
         *         name: property_status_id
         *         schema:
         *           type: integer
         *       - in: query
         *         name: city_id
         *         schema:
         *           type: integer
         *       - in: query
         *         name: min_price
         *         schema:
         *           type: number
         *       - in: query
         *         name: max_price
         *         schema:
         *           type: number
         *       - in: query
         *         name: search
         *         schema:
         *           type: string
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *       - in: query
         *         name: offset
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: List of properties
         */
        router.get('/', (req, res) => controller.listProperties(req, res));

        /**
         * @swagger
         * /api/properties/{id}:
         *   get:
         *     summary: Get property by ID with all relations
         *     tags: [Properties]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *       - in: query
         *         name: includeArchived
         *         schema:
         *           type: boolean
         *     responses:
         *       200:
         *         description: Property details
         *       404:
         *         description: Property not found
         */
        router.get('/:id', (req, res) => controller.getPropertyById(req, res));

        router.post(
            '/',
            authMiddleware.authenticate, // Requiere autenticación
            UploadMiddleware.multiple('images', 10, 5 * 1024 * 1024), // Máximo 10 imágenes, 5MB cada una
            (req, res) => controller.createProperty(req, res)
        );

        /**
         * @swagger
         * /api/properties/grouped:
         *   post:
         *     summary: Create a new property with grouped structure (recommended endpoint)
         *     description: |
         *       Creates a property with a structured, grouped data format.
         *       Supports automatic creation of catalogs (geography, services, characteristics).
         *       All fields use camelCase (e.g., basic, geography, address).
         *       Property type, status, and visibility can be in 'basic' or 'characteristics'.
         *       
         *       Example values field:
         *       {
         *         "prices": [
         *           {"price": 150000, "currency_symbol": "USD", "operation_type": "Venta"}
         *         ],
         *         "expenses": [{"amount": 500, "currency_symbol": "ARS", "frequency": "Mensual"}]
         *       }
         *     tags: [Properties]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             required:
         *               - basic
         *               - geography
         *               - address
         *               - values
         *             properties:
         *               basic:
         *                 type: string
         *                 description: |
         *                   JSON string with basic property information.
         *                   Required: title, owner_id, property_type, property_status, visibility_status.
         *                   Example: {"title":"Casa en venta","owner_id":1,"property_type":"Casa","property_status":"Disponible","visibility_status":"Publicado"}
         *               geography:
         *                 type: string
         *                 description: |
         *                   JSON string with country, province, city (will be created if not exists).
         *                   Example: {"country":"Argentina","province":"Buenos Aires","city":"La Plata"}
         *               address:
         *                 type: string
         *                 description: |
         *                   JSON string with address details. Required: street.
         *                   Example: {"street":"Calle 50","number":"1234","neighborhood":"Centro","postal_code":"1900"}
         *               values:
         *                 type: string
         *                 description: |
         *                   JSON string with prices (required, at least one) and expenses (optional).
         *                   Example: {"prices":[{"price":150000,"currency_symbol":"USD","operation_type":"Venta"}]}
         *               characteristics:
         *                 type: string
         *                 description: |
         *                   JSON string with physical characteristics (optional).
         *                   Can include property_type, property_status, visibility_status as fallback.
         *                   Example: {"rooms_count":3,"bedrooms_count":2,"bathrooms_count":2,"parking_spaces_count":2}
         *               surface:
         *                 type: string
         *                 description: |
         *                   JSON string with surface data (optional).
         *                   Example: {"land_area":300,"covered_area":150,"total_area":300}
         *               services:
         *                 type: string
         *                 description: |
         *                   JSON string with services array (optional, will be created if not exists).
         *                   Example: {"services":["Agua corriente","Gas natural","Pileta"]}
         *               internal:
         *                 type: string
         *                 description: |
         *                   JSON string with internal information (optional).
         *                   Example: {"branch_name":"Sucursal Centro","appraiser":"Juan Pérez"}
         *               images:
         *                 type: array
         *                 items:
         *                   type: string
         *                   format: binary
         *                 description: Property images (optional, max 10, 5MB each)
         *               documents:
         *                 type: array
         *                 items:
         *                   type: string
         *                   format: binary
         *                 description: PDF documents (optional, max 10, 10MB each)
         *               documentNames:
         *                 type: string
         *                 description: |
         *                   JSON array with document names corresponding to documents (optional).
         *                   Example: ["Escritura","Plano","Título"]
         *     responses:
         *       201:
         *         description: Property created successfully with all relations
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                 data:
         *                   type: object
         *       400:
         *         description: Bad request (validation error)
         *       401:
         *         description: Unauthorized (missing or invalid token)
         */
        router.post(
            '/grouped',
            authMiddleware.authenticate,
            UploadMiddleware.imagesAndDocuments({
                imageField: 'images',
                documentField: 'documents',
                maxImages: 10,
                maxDocuments: 10,
                maxImageSize: 5 * 1024 * 1024, // 5MB
                maxDocumentSize: 10 * 1024 * 1024 // 10MB for PDFs
            }),
            (req, res) => controller.createPropertyGrouped(req, res)
        );

        /**
         * @swagger
         * /api/properties/{id}:
         *   put:
         *     summary: Update a property
         *     tags: [Properties]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *     responses:
         *       200:
         *         description: Property updated
         *       404:
         *         description: Property not found
         */
        router.put(
            '/:id',
            authMiddleware.authenticate,
            (req, res) => controller.updateProperty(req, res)
        );

        /**
         * @swagger
         * /api/properties/{id}/archive:
         *   post:
         *     summary: Archive a property
         *     tags: [Properties]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Property archived
         *       404:
         *         description: Property not found
         */
        router.post(
            '/:id/archive',
            authMiddleware.authenticate,
            (req, res) => controller.archiveProperty(req, res)
        );

        /**
         * @swagger
         * /api/properties/{id}/unarchive:
         *   post:
         *     summary: Unarchive a property
         *     tags: [Properties]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Property unarchived
         *       404:
         *         description: Property not found
         */
        router.post(
            '/:id/unarchive',
            authMiddleware.authenticate,
            (req, res) => controller.unarchiveProperty(req, res)
        );

        /**
         * @swagger
         * /api/properties/{id}:
         *   delete:
         *     summary: Delete a property (hard delete)
         *     tags: [Properties]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Property deleted
         *       400:
         *         description: Cannot delete (has active relations)
         *       404:
         *         description: Property not found
         */
        router.delete(
            '/:id',
            authMiddleware.authenticate,
            (req, res) => controller.deleteProperty(req, res)
        );

        return router;
    }
}

