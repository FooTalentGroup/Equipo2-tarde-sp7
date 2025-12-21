
export function hasValueChanged(newValue: unknown, oldValue: unknown): boolean {
    if (newValue === undefined) return false;
    
    if (newValue === null && (oldValue === null || oldValue === undefined)) return false;
    if (oldValue === null && newValue === null) return false;
    
    const normalizedNew = normalizeValue(newValue);
    const normalizedOld = normalizeValue(oldValue);
    
    return normalizedNew !== normalizedOld;
}

function normalizeValue(value: unknown): string | number | boolean | null | undefined {
    if (value === null || value === undefined) return value;
    
    if (typeof value === 'string') {
        return value.trim();
    }
    
    if (typeof value === 'number' || typeof value === 'boolean') {
        return value;
    }
    
    return String(value);
}


export function getChangedFields<T extends Record<string, any>>(
    updateDto: Partial<T>,
    existingEntity: T
): Partial<T> {
    const changedFields: Partial<T> = {};
    
    for (const key in updateDto) {
        if (updateDto.hasOwnProperty(key) && updateDto[key] !== undefined) {
            if (hasValueChanged(updateDto[key], existingEntity[key])) {
                changedFields[key] = updateDto[key];
            }
        }
    }
    
    return changedFields;
}



