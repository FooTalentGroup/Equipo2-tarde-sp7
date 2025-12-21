
export interface FileUploadAdapter {

    uploadFile(
        file: Buffer | string,
        options?: {
            folder?: string;
            publicId?: string;
            resourceType?: 'image' | 'video' | 'raw' | 'auto';
            mimeType?: string;
        }
    ): Promise<string>;

    deleteFile(identifier: string): Promise<boolean>;
}

