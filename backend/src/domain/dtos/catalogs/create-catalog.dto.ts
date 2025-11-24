export class CreateCatalogDto {
    constructor(
        public readonly title: string,
    ){}

    static create( object: { [key: string]: any }): [string?, CreateCatalogDto?] {
        const { title } = object;
        
        if (!title || title.trim().length === 0) {
            return ['Title is required', undefined];
        }
        
        if (title.trim().length < 2) {
            return ['Title must be at least 2 characters', undefined];
        }
        
        if (title.trim().length > 200) {
            return ['Title must be less than 200 characters', undefined];
        }

        return [
            undefined, 
            new CreateCatalogDto(title.trim())
        ];
    }
}

