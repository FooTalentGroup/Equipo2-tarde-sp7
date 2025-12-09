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
     * Implementa detección de duplicados antes de crear:
     * 1. Verifica por email (si se proporciona)
     * 2. Verifica por DNI (si se proporciona)
     * 3. Verifica por teléfono + nombre + apellido
     * 
     * @param clientData - Datos básicos del cliente
     * @param categoryId - ID de la categoría de contacto
     * @returns Objeto con el cliente y flag indicando si fue creado o ya existía
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
    ): Promise<{ client: any; wasCreated: boolean }> {
        // 1. PRIORIDAD 1: Verificar duplicado por email (si se proporciona)
        if (clientData.email) {
            const existingByEmail = await ClientModel.findByEmail(clientData.email);
            if (existingByEmail) {
                console.log(`Duplicate detected: Client found by email ${clientData.email}`);
                return { client: existingByEmail, wasCreated: false };
            }
        }

        // 2. PRIORIDAD 1.5: Verificar duplicado por DNI (si se proporciona)
        if (clientData.dni) {
            const existingByDni = await ClientModel.findByDni(clientData.dni);
            if (existingByDni) {
                console.log(`Duplicate detected: Client found by DNI ${clientData.dni}`);
                return { client: existingByDni, wasCreated: false };
            }
        }

        // 3. PRIORIDAD 2: Verificar duplicado por teléfono + nombre + apellido
        const normalizedPhone = normalizePhone(clientData.phone);
        const clientsByPhone = await ClientModel.findByPhone(normalizedPhone);
        
        if (clientsByPhone && clientsByPhone.length > 0) {
            const exactMatch = clientsByPhone.find(c =>
                c.first_name === clientData.first_name &&
                c.last_name === clientData.last_name
            );
            
            if (exactMatch) {
                console.log(`Duplicate detected: Client found by phone ${normalizedPhone} and name ${clientData.first_name} ${clientData.last_name}`);
                return { client: exactMatch, wasCreated: false };
            }
        }

        // 3. No se encontró duplicado, crear nuevo cliente
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
        return { client: newClient, wasCreated: true };
    }
}

