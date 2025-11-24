export class UpdateDepartmentDto {
    constructor(
        public readonly title?: string,
        public readonly id_city?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, UpdateDepartmentDto?] {
        const { title, id_city } = object;
        
        if (!title && !id_city) {
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
            new UpdateDepartmentDto(
                title?.trim() || undefined,
                id_city?.trim() || undefined
            )
        ];
    }
}

