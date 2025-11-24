export class CreateDepartmentDto {
    constructor(
        public readonly title: string,
        public readonly id_city: string,
    ){}

    static create( object: { [key: string]: any }): [string?, CreateDepartmentDto?] {
        const { title, id_city } = object;
        
        if (!title || title.trim().length === 0) {
            return ['Title is required', undefined];
        }
        if (!id_city || id_city.trim().length === 0) {
            return ['City id is required', undefined];
        }
        
        if (title.trim().length < 2) {
            return ['Title must be at least 2 characters', undefined];
        }

        return [
            undefined, 
            new CreateDepartmentDto(title.trim(), id_city.trim())
        ];
    }
}

