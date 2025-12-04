/**
 * Utilidad para normalizar números de teléfono
 * Normaliza el formato para que quepa en el límite de 15 caracteres de la BD
 */

/**
 * Normaliza un número de teléfono para guardarlo en la base de datos
 * Quita espacios, guiones y otros caracteres de formato, pero mantiene el + si está al inicio
 * @param phone - Número de teléfono a normalizar
 * @returns Teléfono normalizado (máximo 15 caracteres)
 */
export function normalizePhone(phone: string): string {
    if (!phone) return phone;
    
    const trimmed = phone.trim();
    
    // Si empieza con +, mantenerlo y quitar espacios/guiones después
    if (trimmed.startsWith('+')) {
        // Mantener el + y quitar todos los espacios, guiones, paréntesis, puntos
        const normalized = '+' + trimmed.substring(1).replace(/[\s\-\(\)\.]/g, '');
        
        // Si aún excede 15 caracteres, truncar (pero esto no debería pasar con números válidos)
        return normalized.length > 15 ? normalized.substring(0, 15) : normalized;
    }
    
    // Si no empieza con +, quitar todos los caracteres no numéricos
    const digitsOnly = trimmed.replace(/\D/g, '');
    
    // Limitar a 15 caracteres
    return digitsOnly.length > 15 ? digitsOnly.substring(0, 15) : digitsOnly;
}

