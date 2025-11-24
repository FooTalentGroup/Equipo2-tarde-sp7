export class UpdateCatalogDto {
    constructor(
        public readonly title?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, UpdateCatalogDto?] {
        const { title } = object;
        
        if (!title) {
            return ['At least one field must be provided', undefined];
        }
        
        if (title.trim().length === 0) {
            return ['Title cannot be empty', undefined];
        }
        
        if (title.trim().length < 2) {
            return ['Title must be at least 2 characters', undefined];
        }
        
        if (title.trim().length > 200) {
            return ['Title must be less than 200 characters', undefined];
        }

        return [
            undefined, 
            new UpdateCatalogDto(title.trim())
        ];
    }
}

