import { 
    ClientModel, 
    ContactCategoryModel,
    PropertyModel
} from '../../../data/postgres/models';
import { CustomError } from '../../../domain';
import { normalizePhone } from '../../../domain/utils/phone-normalization.util';

/**
 * Helper para operaciones comunes de creación de clientes
 * Extrae lógica compartida entre diferentes servicios de clientes
 */
export class ClientCreationHelper {
    
    /**
     * Resuelve el ID de categoría de contacto por nombre
     * @param categoryName - Nombre de la categoría (Lead, Inquilino, Propietario)
     * @returns ID de la categoría
     * @throws CustomError si la categoría no existe
     */
    static async resolveContactCategory(categoryName: string): Promise<number> {
        const category = await ContactCategoryModel.findByName(categoryName);
        if (!category || !category.id) {
            throw CustomError.badRequest(
                `Contact category "${categoryName}" not found. Please ensure the category exists in the database.`
            );
        }
        return category.id;
    }

    /**
     * Valida que una propiedad existe
     * @param propertyId - ID de la propiedad a validar
     * @returns La propiedad si existe
     * @throws CustomError si la propiedad no existe
     */
    static async validatePropertyExists(propertyId: number) {
        const property = await PropertyModel.findById(propertyId);
        if (!property) {
            throw CustomError.badRequest(
                `Property with ID ${propertyId} not found`
            );
        }
        return property;
    }

    /**
     * Crea un cliente básico con los datos proporcionados
     * @param clientData - Datos básicos del cliente
     * @param categoryId - ID de la categoría de contacto
     * @returns Cliente creado
     * @throws CustomError si falla la creación
     */
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
    ) {
        // Normalizar el teléfono antes de guardarlo
        const normalizedPhone = normalizePhone(clientData.phone);
        
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

        return newClient;
    }
}

