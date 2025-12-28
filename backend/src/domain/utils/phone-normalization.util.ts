
export function normalizePhone(phone: string): string {
    if (!phone) return phone;
    
    const trimmed = phone.trim();
    
    if (trimmed.startsWith('+')) {
        const normalized = '+' + trimmed.substring(1).replace(/[\s\-\(\)\.]/g, '');
        
        return normalized.length > 15 ? normalized.substring(0, 15) : normalized;
    }
    
    const digitsOnly = trimmed.replace(/\D/g, '');
    
    return digitsOnly.length > 15 ? digitsOnly.substring(0, 15) : digitsOnly;
}

