import { v2 as cloudinary } from 'cloudinary';
import { envs } from './envs';
import { FileUploadAdapter } from '../domain/interfaces/file-upload.adapter';

// Función para parsear CLOUDINARY_URL
function parseCloudinaryUrl(url: string | undefined): { cloud_name: string; api_key: string; api_secret: string } | null {
    if (!url) return null;
    
    // Formato: cloudinary://api_key:api_secret@cloud_name
    const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (match) {
        return {
            api_key: match[1],
            api_secret: match[2],
            cloud_name: match[3]
        };
    }
    return null;
}

// Obtener configuración de Cloudinary
function getCloudinaryConfig() {
    // Prioridad 1: Variables individuales (más fáciles de modificar)
    if (envs.CLOUDINARY_CLOUD_NAME && envs.CLOUDINARY_API_KEY && envs.CLOUDINARY_API_SECRET) {
        return {
            cloud_name: envs.CLOUDINARY_CLOUD_NAME,
            api_key: envs.CLOUDINARY_API_KEY,
            api_secret: envs.CLOUDINARY_API_SECRET
        };
    }
    
    // Prioridad 2: CLOUDINARY_URL (fallback)
    const urlConfig = parseCloudinaryUrl(envs.CLOUDINARY_URL);
    if (urlConfig) {
        return urlConfig;
    }
    
    // Si no hay ninguna, retornar vacío
    return {
        cloud_name: '',
        api_key: '',
        api_secret: ''
    };
}

const cloudinaryConfig = getCloudinaryConfig();

// Configurar Cloudinary
cloudinary.config({
    cloud_name: cloudinaryConfig.cloud_name,
    api_key: cloudinaryConfig.api_key,
    api_secret: cloudinaryConfig.api_secret,
});

export class CloudinaryAdapter implements FileUploadAdapter {
    private validateConfig(): void {
        const config = getCloudinaryConfig();
        if (!config.cloud_name || !config.api_key || !config.api_secret) {
            throw new Error(
                'Cloudinary credentials are not configured. ' +
                'Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables ' +
                '(or CLOUDINARY_URL as fallback: cloudinary://api_key:api_secret@cloud_name).'
            );
        }
    }

    async uploadFile(
        file: Buffer | string,
        options?: {
            folder?: string;
            publicId?: string;
            resourceType?: 'image' | 'video' | 'raw' | 'auto';
        }
    ): Promise<string> {
        // Validar configuración antes de intentar subir
        this.validateConfig();
        
        try {
            const uploadOptions: any = {
                resource_type: options?.resourceType || 'auto',
            };

            if (options?.folder) {
                uploadOptions.folder = options.folder;
            }

            if (options?.publicId) {
                uploadOptions.public_id = options.publicId;
            }

            let uploadResult;
            
            if (typeof file === 'string') {
                // Si es base64 o URL
                uploadResult = await cloudinary.uploader.upload(file, uploadOptions);
            } else {
                // Si es Buffer, convertir a base64 con el tipo MIME correcto
                const base64 = file.toString('base64');
                const resourceType = options?.resourceType || 'auto';
                
                let dataUri: string;
                if (resourceType === 'raw' || resourceType === 'auto') {
                    // Para PDFs y otros archivos raw, usar formato genérico
                    dataUri = `data:application/octet-stream;base64,${base64}`;
                } else {
                    // Para imágenes, usar formato específico
                    const mimeType = resourceType === 'image' ? 'image/jpeg' : `application/${resourceType}`;
                    dataUri = `data:${mimeType};base64,${base64}`;
                }
                
                uploadResult = await cloudinary.uploader.upload(dataUri, uploadOptions);
            }

            return uploadResult.secure_url;
        } catch (error) {
            throw new Error(`Error uploading file to Cloudinary: ${error}`);
        }
    }

    async deleteFile(identifier: string): Promise<boolean> {
        // Validar configuración antes de intentar eliminar
        this.validateConfig();
        
        try {
            // Extraer public_id de la URL si es necesario
            const publicId = this.extractPublicId(identifier);
            
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        } catch (error) {
            console.error('Error deleting file from Cloudinary:', error);
            return false;
        }
    }

    private extractPublicId(url: string): string {
        // Si ya es un public_id, retornarlo
        if (!url.includes('http')) {
            return url;
        }

        // Extraer public_id de la URL de Cloudinary
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        return filename.split('.')[0];
    }
}

export const cloudinaryAdapter = new CloudinaryAdapter();

