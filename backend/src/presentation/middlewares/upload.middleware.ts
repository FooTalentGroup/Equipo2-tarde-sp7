import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { CustomError } from '../../domain';

/**
 * Middleware para manejar la subida de archivos
 * Configura multer para procesar archivos en memoria
 */
export class UploadMiddleware {
    /**
     * Configura multer para almacenar archivos en memoria
     * Los archivos estarán disponibles en req.files o req.file
     */
    private static storage = multer.memoryStorage();

    /**
     * Filtro de tipos de archivo permitidos para imágenes
     */
    private static imageFileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        // Tipos MIME permitidos para imágenes
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed.'));
        }
    };

    /**
     * Filtro de tipos de archivo permitidos para documentos PDF
     */
    private static documentFileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        // Solo PDF permitidos
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF documents are allowed.'));
        }
    };

    /**
     * Middleware para subir un solo archivo
     * @param fieldName Nombre del campo en el formulario (default: 'file')
     * @param maxSize Tamaño máximo en bytes (default: 5MB)
     */
    static single(fieldName: string = 'file', maxSize: number = 5 * 1024 * 1024) {
        const upload = multer({
            storage: UploadMiddleware.storage,
            fileFilter: UploadMiddleware.imageFileFilter,
            limits: {
                fileSize: maxSize
            }
        });

        return (req: Request, res: Response, next: NextFunction) => {
            upload.single(fieldName)(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(400).json({
                                message: `File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`
                            });
                        }
                        return res.status(400).json({
                            message: `Upload error: ${err.message}`
                        });
                    }
                    return res.status(400).json({
                        message: err.message || 'Error uploading file'
                    });
                }
                next();
            });
        };
    }

    /**
     * Middleware para subir múltiples archivos
     * @param fieldName Nombre del campo en el formulario (default: 'files')
     * @param maxCount Número máximo de archivos (default: 10)
     * @param maxSize Tamaño máximo por archivo en bytes (default: 5MB)
     */
    static multiple(fieldName: string = 'files', maxCount: number = 10, maxSize: number = 5 * 1024 * 1024) {
        const upload = multer({
            storage: UploadMiddleware.storage,
            fileFilter: UploadMiddleware.imageFileFilter,
            limits: {
                fileSize: maxSize,
                files: maxCount
            }
        });

        return (req: Request, res: Response, next: NextFunction) => {
            upload.array(fieldName, maxCount)(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(400).json({
                                message: `File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`
                            });
                        }
                        if (err.code === 'LIMIT_FILE_COUNT') {
                            return res.status(400).json({
                                message: `Number of files exceeds the maximum limit of ${maxCount}`
                            });
                        }
                        return res.status(400).json({
                            message: `Upload error: ${err.message}`
                        });
                    }
                    return res.status(400).json({
                        message: err.message || 'Error uploading files'
                    });
                }
                next();
            });
        };
    }

    /**
     * Middleware para subir archivos con campos específicos
     * @param fields Array de objetos con name y maxCount
     * @param maxSize Tamaño máximo por archivo en bytes (default: 5MB)
     */
    static fields(fields: Array<{ name: string; maxCount?: number }>, maxSize: number = 5 * 1024 * 1024) {
        const upload = multer({
            storage: UploadMiddleware.storage,
            fileFilter: UploadMiddleware.imageFileFilter,
            limits: {
                fileSize: maxSize
            }
        });

        return (req: Request, res: Response, next: NextFunction) => {
            upload.fields(fields)(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(400).json({
                                message: `File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`
                            });
                        }
                        return res.status(400).json({
                            message: `Upload error: ${err.message}`
                        });
                    }
                    return res.status(400).json({
                        message: err.message || 'Error uploading files'
                    });
                }
                next();
            });
        };
    }

    /**
     * Middleware para subir múltiples documentos PDF
     * @param fieldName Nombre del campo en el formulario (default: 'documents')
     * @param maxCount Número máximo de archivos (default: 10)
     * @param maxSize Tamaño máximo por archivo en bytes (default: 10MB para PDFs)
     */
    static documents(fieldName: string = 'documents', maxCount: number = 10, maxSize: number = 10 * 1024 * 1024) {
        const upload = multer({
            storage: UploadMiddleware.storage,
            fileFilter: UploadMiddleware.documentFileFilter,
            limits: {
                fileSize: maxSize,
                files: maxCount
            }
        });

        return (req: Request, res: Response, next: NextFunction) => {
            upload.array(fieldName, maxCount)(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(400).json({
                                message: `File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`
                            });
                        }
                        if (err.code === 'LIMIT_FILE_COUNT') {
                            return res.status(400).json({
                                message: `Number of files exceeds the maximum limit of ${maxCount}`
                            });
                        }
                        return res.status(400).json({
                            message: `Upload error: ${err.message}`
                        });
                    }
                    return res.status(400).json({
                        message: err.message || 'Error uploading documents'
                    });
                }
                next();
            });
        };
    }

    /**
     * Middleware combinado para subir imágenes y documentos
     * @param options Configuración de límites
     */
    static imagesAndDocuments(options: {
        imageField?: string;
        documentField?: string;
        maxImages?: number;
        maxDocuments?: number;
        maxImageSize?: number;
        maxDocumentSize?: number;
    } = {}) {
        const {
            imageField = 'images',
            documentField = 'documents',
            maxImages = 10,
            maxDocuments = 10,
            maxImageSize = 5 * 1024 * 1024,
            maxDocumentSize = 10 * 1024 * 1024
        } = options;

        const upload = multer({
            storage: UploadMiddleware.storage,
            fileFilter: (req, file, cb) => {
                // Determinar el tipo de filtro según el campo
                if (file.fieldname === imageField) {
                    UploadMiddleware.imageFileFilter(req, file, cb);
                } else if (file.fieldname === documentField) {
                    UploadMiddleware.documentFileFilter(req, file, cb);
                } else {
                    cb(new Error(`Unknown field: ${file.fieldname}`));
                }
            },
            limits: {
                fileSize: Math.max(maxImageSize, maxDocumentSize)
            }
        });

        return (req: Request, res: Response, next: NextFunction) => {
            const fields = [
                { name: imageField, maxCount: maxImages },
                { name: documentField, maxCount: maxDocuments }
            ];

            upload.fields(fields)(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(400).json({
                                message: `File size exceeds the maximum limit`
                            });
                        }
                        return res.status(400).json({
                            message: `Upload error: ${err.message}`
                        });
                    }
                    return res.status(400).json({
                        message: err.message || 'Error uploading files'
                    });
                }
                next();
            });
        };
    }
}

