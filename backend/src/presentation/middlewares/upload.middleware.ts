import multer from 'multer';
import { Request } from 'express';

// Configurar multer para almacenar archivos en memoria (Buffer)
const storage = multer.memoryStorage();

// Configurar límites de archivo
const limits = {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
};

// Filtro para aceptar solo imágenes
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Verificar que sea una imagen
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

// Configurar multer
export const uploadMiddleware = multer({
    storage,
    limits,
    fileFilter
});

// Middleware específico para property_file
export const uploadPropertyFile = uploadMiddleware.single('property_file');

