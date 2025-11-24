export class AddServiceDto {
    constructor(
        public readonly service_id: string,
    ){}

    static create( object: { [key: string]: any }): [string?, AddServiceDto?] {
        const { service_id } = object;
        
        if (!service_id || service_id.trim().length === 0) {
            return ['Service id is required', undefined];
        }

        return [
            undefined, 
            new AddServiceDto(service_id.trim())
        ];
    }
}

