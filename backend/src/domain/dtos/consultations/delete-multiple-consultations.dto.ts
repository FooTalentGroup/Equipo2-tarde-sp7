export class DeleteMultipleConsultationsDto {
    private constructor(
        public readonly consultation_ids: number[]
    ) {}

    static create(object: Record<string, unknown>): [string?, DeleteMultipleConsultationsDto?] {
        const { consultation_ids } = object;

        if (!consultation_ids) {
            return ['consultation_ids is required'];
        }
        if (!Array.isArray(consultation_ids)) {
            return ['consultation_ids must be an array'];
        }

        if (consultation_ids.length === 0) {
            return ['At least one consultation ID is required'];
        }
        if (consultation_ids.length > 100) {
            return ['Cannot delete more than 100 consultations at once'];
        }

        for (const id of consultation_ids) {
            if (typeof id !== 'number') {
                return ['All consultation IDs must be numbers'];
            }
            if (!Number.isInteger(id)) {
                return ['All consultation IDs must be integers'];
            }
            if (id <= 0) {
                return ['All consultation IDs must be positive numbers'];
            }
        }

        return [
            undefined,
            new DeleteMultipleConsultationsDto(consultation_ids)
        ];
    }
}
