import { 
    ClientModel, 
    ContactCategoryModel,
    PropertyModel
} from '../../../data/postgres/models';
import { CustomError, ClientEntity } from '../../../domain';
import { normalizePhone } from '../../../domain/utils/phone-normalization.util';

export class ClientCreationHelper {
    

    static async resolveContactCategory(categoryName: string): Promise<number> {
        const category = await ContactCategoryModel.findByName(categoryName);
        if (!category || !category.id) {
            throw CustomError.badRequest(
                `Contact category "${categoryName}" not found. Please ensure the category exists in the database.`
            );
        }
        return category.id;
    }

    static async validatePropertyExists(propertyId: number) {
        const property = await PropertyModel.findById(propertyId);
        if (!property) {
            throw CustomError.badRequest(
                `Property with ID ${propertyId} not found`
            );
        }
        return property;
    }

    
    static async createBaseClient(
        clientData: {
            first_name: string;
            last_name: string;
            phone: string;
            email?: string;
            dni?: string;
            address?: string;
            notes?: string;
            rental_interest?: boolean;
            purchase_interest?: boolean;
        },
        categoryId: number
    ): Promise<{ client: ClientEntity; wasCreated: boolean }> {
        if (clientData.email) {
            const existingByEmail = await ClientModel.findByEmail(clientData.email);
            if (existingByEmail) {
                throw CustomError.conflict(
                    `El cliente con email ${clientData.email} ya existe. No se permiten duplicados.`
                );
            }
        }

        if (clientData.dni) {
            const existingByDni = await ClientModel.findByDni(clientData.dni);
            if (existingByDni) {
                throw CustomError.conflict(
                    `El cliente con DNI ${clientData.dni} ya existe. No se permiten duplicados.`
                );
            }
        }

        const normalizedPhone = normalizePhone(clientData.phone);
        const clientsByPhone = await ClientModel.findByPhone(normalizedPhone);
        
        if (clientsByPhone && clientsByPhone.length > 0) {
            const exactMatch = clientsByPhone.find(c =>
                c.first_name === clientData.first_name &&
                c.last_name === clientData.last_name
            );
            
            if (exactMatch) {
                throw CustomError.conflict(
                    `El cliente ${clientData.first_name} ${clientData.last_name} con teléfono ${normalizedPhone} ya existe. No se permiten duplicados.`
                );
            }
        }

        const newClient = await ClientModel.create({
            first_name: clientData.first_name,
            last_name: clientData.last_name,
            phone: normalizedPhone,
            email: clientData.email,
            dni: clientData.dni,
            address: clientData.address,
            notes: clientData.notes,
            contact_category_id: categoryId,
            rental_interest: clientData.rental_interest,
            purchase_interest: clientData.purchase_interest,
        });

        if (!newClient.id) {
            throw CustomError.internalServerError('Failed to create client');
        }

        console.log(`New client created with ID: ${newClient.id}`);
        return { client: ClientEntity.fromDatabaseObject(newClient), wasCreated: true };
    }
}

