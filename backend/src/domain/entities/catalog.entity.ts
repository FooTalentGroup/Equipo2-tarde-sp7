import { CustomError } from "../errors/custom.error";

/**
 * Generic entity for catalog items (Countries, Cities, Departments, PropertyTypes, etc.)
 * These are simple entities with just id and title
 */
export class CatalogEntity {
    constructor(
        public id: string,
        public title: string,
    ) {}

    static fromObject(object: { [key: string]: any }): CatalogEntity {
        const { id, title } = object;
        
        if (!id) throw CustomError.badRequest('Id is required');
        if (!title || title.trim().length === 0) {
            throw CustomError.badRequest('Title is required');
        }

        return new CatalogEntity(
            id,
            title.trim()
        );
    }
}

