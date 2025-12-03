/**
 * DTO para documentos PDF de la propiedad
 * Se envía como parte de form-data, múltiples archivos
 */
export interface CreatePropertyDocumentDto {
    document_name: string; // Nombre del documento (ej: "Escritura", "Contrato")
    // file_path se genera después de subir el archivo
}




