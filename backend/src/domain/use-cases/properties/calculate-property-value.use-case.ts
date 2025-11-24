/**
 * Use Case: Calcular valor de propiedad con descuentos/recargos
 * Regla de negocio pura, sin dependencias externas
 */
export class CalculatePropertyValueUseCase {
    static execute(
        basePrice: number,
        discount?: number,
        surcharge?: number
    ): number {
        if (basePrice < 0) {
            return 0;
        }
        
        let finalPrice = basePrice;
        
        // Aplicar descuento si existe
        if (discount && discount > 0) {
            finalPrice = finalPrice * (1 - discount / 100);
        }
        
        // Aplicar recargo si existe
        if (surcharge && surcharge > 0) {
            finalPrice = finalPrice * (1 + surcharge / 100);
        }
        
        return Math.round(finalPrice * 100) / 100; // Redondear a 2 decimales
    }
}

