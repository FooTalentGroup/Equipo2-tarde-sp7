import { CreatePropertyPriceDto } from './create-property-price.dto';


export interface CreatePropertyExpenseDto {
    amount: number;
    currency_symbol?: string; 
    currency_type_id?: number;
    frequency?: string; 
}

export interface CreatePropertyValuesDto {
    prices: CreatePropertyPriceDto[];
    expenses?: CreatePropertyExpenseDto[];
}




