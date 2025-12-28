import { TransactionHelper } from '../../data/postgres/transaction.helper';
import { 
    ClientRentalModel,
    RentalModel,
    CurrencyTypeModel,
    PropertyModel,
    PropertyTypeModel,
    PropertyStatusModel,
    ClientPropertyInterestModel
} from '../../data/postgres/models';
import { CreateTenantDto } from '../../domain/dtos/clients/create-tenant.dto';
import { CustomError, ClientEntity } from '../../domain';
import { ClientCreationHelper } from './helpers/client-creation.helper';


export class TenantServices {
    
 
    async createTenantWithProperty(
        createTenantDto: CreateTenantDto,
        createdByUserId: number
    ) {
        return await TransactionHelper.executeInTransaction(async () => {
            const categoryId = await ClientCreationHelper.resolveContactCategory('Inquilino');

            let propertyId: number | undefined = undefined;
            if (createTenantDto.property_id) {
                await ClientCreationHelper.validatePropertyExists(createTenantDto.property_id);
                propertyId = createTenantDto.property_id;

                const activeRental = await RentalModel.findActiveByPropertyId(propertyId);
                if (activeRental) {
                    throw CustomError.badRequest(
                        'La propiedad ya está alquilada a otro inquilino. No se puede crear un nuevo alquiler.'
                    );
                }
            }

            let currencyTypeId: number | undefined = undefined;
            if (createTenantDto.currency_type_id) {
                currencyTypeId = createTenantDto.currency_type_id;
            } else if (createTenantDto.currency_type) {
                let currencyType = await CurrencyTypeModel.findByName(createTenantDto.currency_type);
                
                if (!currencyType || !currencyType.id) {
                    currencyType = await CurrencyTypeModel.findBySymbol(createTenantDto.currency_type);
                }
                
                if (!currencyType || !currencyType.id) {
                    throw CustomError.badRequest(
                        `Currency type "${createTenantDto.currency_type}" not found. Use the name (e.g., "Peso Argentino") or symbol (e.g., "ARS")`
                    );
                }
                currencyTypeId = currencyType.id;
            }

            const { client: newClient, wasCreated } = await ClientCreationHelper.createBaseClient({
                first_name: createTenantDto.first_name,
                last_name: createTenantDto.last_name,
                phone: createTenantDto.phone,
                email: createTenantDto.email,
                dni: createTenantDto.dni,
                address: createTenantDto.address,
                notes: createTenantDto.notes,
                rental_interest: true,
            }, categoryId);

            let clientRental = null;
            let rental = null;

            if (propertyId && createTenantDto.contract_start_date && newClient.id) {
                const normalizeDate = (date: string | Date | undefined): Date | undefined => {
                    if (!date) return undefined;
                    
                    let dateStr: string;
                    if (typeof date === 'string') {
                        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                            throw CustomError.badRequest(`Invalid date format. Expected YYYY-MM-DD, got: ${date}`);
                        }
                        dateStr = date;
                    } else {
                        dateStr = date.toISOString().split('T')[0];
                    }
                    
                    const [year, month, day] = dateStr.split('-').map(Number);
                    return new Date(Date.UTC(year, month - 1, day));
                };

                const normalizedStartDate = normalizeDate(createTenantDto.contract_start_date);
                const normalizedEndDate = normalizeDate(createTenantDto.contract_end_date);
                const normalizedIncreaseDate = normalizeDate(createTenantDto.next_increase_date);

                clientRental = await ClientRentalModel.create({
                    client_id: newClient.id,
                    property_id: propertyId,
                    external_reference: createTenantDto.external_reference,
                    contract_start_date: normalizedStartDate,
                    contract_end_date: normalizedEndDate,
                    next_increase_date: normalizedIncreaseDate,
                    remind_increase: createTenantDto.remind_increase ?? false,
                    remind_contract_end: createTenantDto.remind_contract_end ?? false,
                });

                if (createTenantDto.monthly_amount && currencyTypeId && clientRental.id) {
                    rental = await RentalModel.create({
                        property_id: propertyId,
                        client_rental_id: clientRental.id,
                        start_date: normalizedStartDate!,
                        end_date: normalizedEndDate,
                        next_increase_date: normalizedIncreaseDate,
                        monthly_amount: createTenantDto.monthly_amount,
                        currency_type_id: currencyTypeId,
                        created_by_user_id: createdByUserId,
                        remind_increase: createTenantDto.remind_increase ?? false,
                        remind_contract_end: createTenantDto.remind_contract_end ?? false,
                    });

                    await PropertyModel.update(propertyId, {
                        property_status_id: 3
                    });
                }
            }

            const clientEntity = ClientEntity.fromDatabaseObject(newClient);

            let rentedProperty = null;
            if (clientRental && propertyId) {
                const property = await PropertyModel.findById(propertyId);
                if (property) {
                    const [propertyType, propertyStatus] = await Promise.all([
                        PropertyTypeModel.findById(property.property_type_id),
                        PropertyStatusModel.findById(property.property_status_id)
                    ]);

                    let currency = null;
                    if (rental?.currency_type_id) {
                        currency = await CurrencyTypeModel.findById(rental.currency_type_id);
                    }

                    rentedProperty = {
                        id: property.id,
                        title: property.title,
                        description: property.description,
                        property_type: propertyType ? { id: propertyType.id, name: propertyType.name } : null,
                        property_status: propertyStatus ? { id: propertyStatus.id, name: propertyStatus.name } : null,
                        rental: {
                            id: clientRental.id,
                            contract_start_date: clientRental.contract_start_date,
                            contract_end_date: clientRental.contract_end_date,
                            next_increase_date: clientRental.next_increase_date,
                            monthly_amount: rental?.monthly_amount || null,
                            currency: currency ? { id: currency.id, name: currency.name, symbol: currency.symbol } : null,
                            external_reference: clientRental.external_reference || null
                        }
                    };
                }
            }

            let propertiesOfInterest: Array<{
                id: number;
                title: string;
                property_type: { id: number; name: string } | null;
                property_status: { id: number; name: string } | null;
                interest_created_at: Date | undefined;
                interest_notes: string | undefined;
            }> = [];
            if (newClient.id) {
                const interests = await ClientPropertyInterestModel.findByClientId(newClient.id);
                if (interests.length > 0) {
                    const properties = await Promise.all(
                        interests.map(async (interest) => {
                            const property = await PropertyModel.findById(interest.property_id);
                            if (!property || !property.id) return null;
                            
                            const [propertyType, propertyStatus] = await Promise.all([
                                PropertyTypeModel.findById(property.property_type_id),
                                PropertyStatusModel.findById(property.property_status_id)
                            ]);

                            return {
                                id: property.id,
                                title: property.title,
                                property_type: propertyType && propertyType.id ? { id: propertyType.id, name: propertyType.name } : null,
                                property_status: propertyStatus && propertyStatus.id ? { id: propertyStatus.id, name: propertyStatus.name } : null,
                                interest_created_at: interest.created_at,
                                interest_notes: interest.notes
                            };
                        })
                    );
                    propertiesOfInterest = properties.filter((p): p is NonNullable<typeof p> => p !== null);
                }
            }

            const clientPublic = clientEntity.toPublicObject();
            delete (clientPublic as Record<string, unknown>).property_interest_phone;
            delete (clientPublic as Record<string, unknown>).property_search_type_id;

            return {
                client: clientPublic,
                rented_property: rentedProperty,
                properties_of_interest: propertiesOfInterest,
                client_rental: clientRental ? {
                    id: clientRental.id,
                    property_id: clientRental.property_id,
                    contract_start_date: clientRental.contract_start_date,
                    contract_end_date: clientRental.contract_end_date,
                    next_increase_date: clientRental.next_increase_date,
                } : null,
                rental: rental ? {
                    id: rental.id,
                    monthly_amount: rental.monthly_amount,
                    currency_type_id: rental.currency_type_id,
                    start_date: rental.start_date,
                    end_date: rental.end_date,
                } : null,
            };
        });
    }
}

