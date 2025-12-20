import { CustomError } from '../errors/custom.error';

/**
 * Entity de dominio para Property
 * Contiene la lógica de negocio y validaciones
 */
export class PropertyEntity {
    constructor(
        public id: number,
        public title: string,
        public property_type_id: number,
        public property_status_id: number,
        public visibility_status_id: number,
        public captured_by_user_id: number,
        public owner_id?: number,
        public description?: string,
        public bedrooms_count?: number,
        public bathrooms_count?: number,
        public rooms_count?: number,
        public parking_spaces_count?: number,
        public land_area?: number,
        public covered_area?: number,
        public total_area?: number,
        public publication_date?: Date,
        public updated_at?: Date,
    ) {}

    static fromObject(object: Record<string, unknown>): PropertyEntity {
        const {
            id,
            title,
            description,
            property_type_id,
            property_status_id,
            visibility_status_id,
            owner_id,
            captured_by_user_id,
            bedrooms_count,
            bathrooms_count,
            rooms_count,
            parking_spaces_count,
            land_area,
            covered_area,
            total_area,
            publication_date,
            updated_at,
        } = object;

        if (!id) throw CustomError.badRequest('Property ID is required');
        if (!title || title.trim().length === 0) {
            throw CustomError.badRequest('Property title is required');
        }
        if (!property_type_id) {
            throw CustomError.badRequest('Property type ID is required');
        }
        if (!property_status_id) {
            throw CustomError.badRequest('Property status ID is required');
        }
        if (!visibility_status_id) {
            throw CustomError.badRequest('Visibility status ID is required');
        }
        if (!captured_by_user_id) {
            throw CustomError.badRequest('Captured by user ID is required');
        }

        return new PropertyEntity(
            Number(id),
            title.trim(),
            Number(property_type_id),
            Number(property_status_id),
            Number(visibility_status_id),
            Number(captured_by_user_id),
            owner_id ? Number(owner_id) : undefined,
            description?.trim(),
            bedrooms_count !== undefined ? Number(bedrooms_count) : undefined,
            bathrooms_count !== undefined ? Number(bathrooms_count) : undefined,
            rooms_count !== undefined ? Number(rooms_count) : undefined,
            parking_spaces_count !== undefined ? Number(parking_spaces_count) : undefined,
            land_area !== undefined ? Number(land_area) : undefined,
            covered_area !== undefined ? Number(covered_area) : undefined,
            total_area !== undefined ? Number(total_area) : undefined,
            publication_date ? new Date(publication_date) : undefined,
            updated_at ? new Date(updated_at) : undefined,
        );
    }

    /**
     * Valida que la propiedad pueda ser actualizada
     */
    canBeUpdated(): boolean {
        // Lógica de negocio: por ejemplo, no se puede actualizar si está vendida
        // Esto se puede expandir según las reglas de negocio
        return true;
    }

    /**
     * Valida que la propiedad pueda ser archivada
     */
    canBeArchived(): boolean {
        // Lógica de negocio: por ejemplo, no se puede archivar si tiene rentas activas
        // Esto se puede expandir según las reglas de negocio
        return true;
    }
}

