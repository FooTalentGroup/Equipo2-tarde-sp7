import { CreatePropertyPriceDto } from './create-property-price.dto';

/**
 * DTO para valores y precios de la propiedad
 */
export interface CreatePropertyExpenseDto {
    amount: number;
    currency_symbol?: string; // "ARS", "USD", "EUR" o currency_type_id
    currency_type_id?: number;
    frequency?: string; // "Mensual", "Anual", etc. (opcional)
}

export interface CreatePropertyValuesDto {
    prices: CreatePropertyPriceDto[]; // Array de precios (venta, alquiler, etc.)
    expenses?: CreatePropertyExpenseDto[]; // Array de expensas (opcional)
}




