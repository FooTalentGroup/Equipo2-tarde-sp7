/**
 * Interface para adaptadores de subida de archivos
 * Permite cambiar entre diferentes proveedores (Cloudinary, AWS S3, etc.)
 * sin comprometer el código a terceros
 */
export interface FileUploadAdapter {
    /**
     * Sube un archivo y retorna la URL pública
     * @param file Buffer o string base64 del archivo
     * @param folder Carpeta donde se guardará (opcional)
     * @param publicId ID público personalizado (opcional)
     * @returns URL pública del archivo subido
     */
    uploadFile(
        file: Buffer | string,
        options?: {
            folder?: string;
            publicId?: string;
            resourceType?: 'image' | 'video' | 'raw' | 'auto';
            mimeType?: string;
        }
    ): Promise<string>;

    /**
     * Elimina un archivo por su URL o publicId
     * @param identifier URL o publicId del archivo
     * @returns true si se eliminó correctamente
     */
    deleteFile(identifier: string): Promise<boolean>;
}

