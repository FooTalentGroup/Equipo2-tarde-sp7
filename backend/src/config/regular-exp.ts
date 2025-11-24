
export const regularExps = {
    // Email: formato estándar de email
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    
    // Phone: formato internacional, acepta +, espacios, guiones y paréntesis
    // Ejemplos válidos: +1234567890, (123) 456-7890, 123-456-7890, 1234567890
    phone: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
    
    // WhatsApp: similar a phone pero puede incluir caracteres de WhatsApp
    whatsapp: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
}