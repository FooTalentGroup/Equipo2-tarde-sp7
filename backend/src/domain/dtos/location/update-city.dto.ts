export class UpdateCityDto {
    constructor(
        public readonly title?: string,
        public readonly id_country?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, UpdateCityDto?] {
        const { title, id_country } = object;
        
        if (!title && !id_country) {
            return ['At least one field must be provided', undefined];
        }
        
        if (title !== undefined && title !== null) {
            if (title.trim().length === 0) {
                return ['Title cannot be empty', undefined];
            }
            if (title.trim().length < 2) {
                return ['Title must be at least 2 characters', undefined];
            }
        }

        return [
            undefined, 
            new UpdateCityDto(
                title?.trim() || undefined,
                id_country?.trim() || undefined
            )
        ];
    }
}

