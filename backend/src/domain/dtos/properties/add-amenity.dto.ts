export class AddAmenityDto {
    constructor(
        public readonly amenity_id: string,
    ){}

    static create( object: { [key: string]: any }): [string?, AddAmenityDto?] {
        const { amenity_id } = object;
        
        if (!amenity_id || amenity_id.trim().length === 0) {
            return ['Amenity id is required', undefined];
        }

        return [
            undefined, 
            new AddAmenityDto(amenity_id.trim())
        ];
    }
}

