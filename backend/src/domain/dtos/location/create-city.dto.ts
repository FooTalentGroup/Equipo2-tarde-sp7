export class CreateCityDto {
    constructor(
        public readonly title: string,
        public readonly id_country: string,
    ){}

    static create( object: { [key: string]: any }): [string?, CreateCityDto?] {
        const { title, id_country } = object;
        
        if (!title || title.trim().length === 0) {
            return ['Title is required', undefined];
        }
        if (!id_country || id_country.trim().length === 0) {
            return ['Country id is required', undefined];
        }
        
        if (title.trim().length < 2) {
            return ['Title must be at least 2 characters', undefined];
        }

        return [
            undefined, 
            new CreateCityDto(title.trim(), id_country.trim())
        ];
    }
}

