
export function validateFirstName(first_name: unknown): [string?, void?] {
    if (!first_name || typeof first_name !== 'string' || first_name.trim().length === 0) {
        return ['First name is required', undefined];
    }
    
    if (first_name.trim().length < 2) {
        return ['First name must be at least 2 characters', undefined];
    }
    
    if (first_name.trim().length > 100) {
        return ['First name must be less than 100 characters', undefined];
    }
    
    return [undefined, undefined];
}


export function validateLastName(last_name: unknown): [string?, void?] {
    if (!last_name || typeof last_name !== 'string' || last_name.trim().length === 0) {
        return ['Last name is required', undefined];
    }
    
    if (last_name.trim().length < 2) {
        return ['Last name must be at least 2 characters', undefined];
    }
    
    if (last_name.trim().length > 100) {
        return ['Last name must be less than 100 characters', undefined];
    }
    
    return [undefined, undefined];
}

export function validatePhone(phone: unknown): [string?, void?] {
    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
        return ['Phone is required', undefined];
    }

    const trimmedPhone = phone.trim();
    const validCharsRegex = /^[\d\s\-\(\)\+\.]+$/;
    if (!validCharsRegex.test(trimmedPhone)) {
        return ['Invalid phone format: phone can only contain numbers, spaces, dashes, parentheses, plus sign, and dots', undefined];
    }
    
    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
        return ['Invalid phone format: phone must contain at least 10 digits', undefined];
    }
    
    if (digitsOnly.length > 15) {
        return ['Invalid phone format: phone must contain at most 15 digits', undefined];
    }
    
    const normalized = trimmedPhone.startsWith('+') 
        ? '+' + trimmedPhone.substring(1).replace(/[\s\-\(\)\.]/g, '')
        : digitsOnly;
    
    if (normalized.length > 15) {
        return ['Invalid phone format: phone number is too long. Please use a shorter format (e.g., +541199990000 instead of +54 11 9999-0000)', undefined];
    }
    
    return [undefined, undefined];
}


export function validateEmail(email: unknown, required: boolean = false): [string?, void?] {
    if (required && (!email || typeof email !== 'string' || email.trim().length === 0)) {
        return ['Email is required', undefined];
    }

    if (email && typeof email === 'string' && email.trim().length > 0) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            return ['Invalid email format', undefined];
        }
        if (email.trim().length > 255) {
            return ['Email must be less than 255 characters', undefined];
        }
    }
    
    return [undefined, undefined];
}

export function validateDni(dni: unknown): [string?, void?] {
    if (dni && typeof dni === 'string' && dni.trim().length > 0) {
        const trimmedDni = dni.trim();
        const dniRegex = /^[\d\s\-]{7,}$/;
        if (!dniRegex.test(trimmedDni)) {
            return ['Invalid DNI format: DNI can only contain numbers, spaces, and dashes', undefined];
        }
        const dniDigitsOnly = trimmedDni.replace(/\D/g, '');
        if (dniDigitsOnly.length < 7 || dniDigitsOnly.length > 15) {
            return ['Invalid DNI format: DNI must contain between 7 and 15 digits', undefined];
        }
    }
    
    return [undefined, undefined];
}


export function validatePropertyId(property_id: unknown): [string?, void?] {
    if (property_id !== undefined && property_id !== null) {
        if (isNaN(Number(property_id))) {
            return ['Property ID must be a number', undefined];
        }
    }
    
    return [undefined, undefined];
}

