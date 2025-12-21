import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { envs } from './envs';
import { FileUploadAdapter } from '../domain/interfaces/file-upload.adapter';

function getCloudinaryConfig() {
    if (envs.CLOUDINARY_CLOUD_NAME && envs.CLOUDINARY_API_KEY && envs.CLOUDINARY_API_SECRET) {
        return {
            cloud_name: envs.CLOUDINARY_CLOUD_NAME,
            api_key: envs.CLOUDINARY_API_KEY,
            api_secret: envs.CLOUDINARY_API_SECRET
        };
    }
    
    return {
        cloud_name: '',
        api_key: '',
        api_secret: ''
    };
}

const cloudinaryConfig = getCloudinaryConfig();

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
                'Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.'
            );
        }
    }

    async uploadFile(
        file: Buffer | string,
        options?: {
            folder?: string;
            publicId?: string;
            resourceType?: 'image' | 'video' | 'raw' | 'auto';
            mimeType?: string;
        }
    ): Promise<string> {
        this.validateConfig();
        
        try {
            const uploadOptions: Partial<UploadApiOptions> = {
                resource_type: options?.resourceType || 'auto',
            };

            if (options?.folder) {
                uploadOptions.folder = options.folder;
            }

            if (options?.resourceType === 'raw' && options?.mimeType === 'application/pdf') {
                if (!options.publicId || !options.publicId.endsWith('.pdf')) {
                    uploadOptions.format = 'pdf';
                }
            }

            if (options?.publicId) {
                uploadOptions.public_id = options.publicId;
            }

            let uploadResult;
            
            if (typeof file === 'string') {
                uploadResult = await cloudinary.uploader.upload(file, uploadOptions);
            } else {
                const base64 = file.toString('base64');
                const resourceType = options?.resourceType || 'auto';
                
                let dataUri: string;
                if (resourceType === 'raw' && options?.mimeType === 'application/pdf') {
                    dataUri = `data:application/pdf;base64,${base64}`;
                } else if (resourceType === 'raw' || resourceType === 'auto') {
                    dataUri = `data:application/octet-stream;base64,${base64}`;
                } else {
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
        this.validateConfig();
        
        try {
            const publicId = this.extractPublicId(identifier);
            
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        } catch (error) {
            console.error('Error deleting file from Cloudinary:', error);
            return false;
        }
    }

    private extractPublicId(url: string): string {
        if (!url.includes('http')) {
            return url;
        }

        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        return filename.split('.')[0];
    }
}

export const cloudinaryAdapter = new CloudinaryAdapter();

