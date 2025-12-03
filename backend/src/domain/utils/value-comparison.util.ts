/**
 * Utility functions for comparing values
 * Used to determine if a field has actually changed before updating
 */

/**
 * Compares two values to determine if they have changed
 * Handles null/undefined, normalizes strings (trim), and compares values
 * 
 * @param newValue - The new value to compare
 * @param oldValue - The existing value to compare against
 * @returns true if values are different, false if they are the same
 */
export function hasValueChanged(newValue: any, oldValue: any): boolean {
    // If newValue is undefined, it means the field wasn't provided - no change
    if (newValue === undefined) return false;
    
    // Handle null comparisons
    if (newValue === null && (oldValue === null || oldValue === undefined)) return false;
    if (oldValue === null && newValue === null) return false;
    
    // Normalize values for comparison
    const normalizedNew = normalizeValue(newValue);
    const normalizedOld = normalizeValue(oldValue);
    
    // Compare normalized values
    return normalizedNew !== normalizedOld;
}

/**
 * Normalizes a value for comparison
 * - Trims strings
 * - Converts to string for consistent comparison
 * - Handles null/undefined
 */
function normalizeValue(value: any): any {
    if (value === null || value === undefined) return value;
    
    if (typeof value === 'string') {
        return value.trim();
    }
    
    if (typeof value === 'number' || typeof value === 'boolean') {
        return value;
    }
    
    // For other types, convert to string for comparison
    return String(value);
}

/**
 * Filters an update object to only include fields that have actually changed
 * 
 * @param updateDto - Object with new values (may include all fields)
 * @param existingEntity - Object with existing values
 * @returns Object containing only the fields that changed
 */
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



