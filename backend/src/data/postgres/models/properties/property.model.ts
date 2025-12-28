import { PostgresDatabase } from '../../database';
import { SqlParams } from '../../../types/sql.types';

export interface Property {
    id?: number;
    title: string;
    description?: string;
    publication_date?: Date;
    featured_web?: boolean;
    visibility_status_id: number;
    captured_by_user_id: number;
    branch_name?: string;
    appraiser?: string;
    producer?: string;
    maintenance_user?: string;
    keys_location?: string;
    internal_comments?: string;
    social_media_info?: string;
    operation_commission_percentage?: number;
    producer_commission_percentage?: number;
    land_area?: number;
    semi_covered_area?: number;
    covered_area?: number;
    total_built_area?: number;
    uncovered_area?: number;
    total_area?: number;
    rooms_count?: number;
    bedrooms_count?: number;
    bathrooms_count?: number;
    toilets_count?: number;
    parking_spaces_count?: number;
    floors_count?: number;
    zoning?: string;
    property_type_id: number;
    property_status_id: number;
    owner_id?: number;
    situation_id?: number;
    age_id?: number;
    orientation_id?: number;
    disposition_id?: number;
    updated_at?: Date;
}

export interface CreatePropertyDto {
    title: string;
    description?: string;
    publication_date?: Date;
    featured_web?: boolean;
    visibility_status_id: number;
    captured_by_user_id: number;
    branch_name?: string;
    appraiser?: string;
    producer?: string;
    maintenance_user?: string;
    keys_location?: string;
    internal_comments?: string;
    social_media_info?: string;
    operation_commission_percentage?: number;
    producer_commission_percentage?: number;
    land_area?: number;
    semi_covered_area?: number;
    covered_area?: number;
    total_built_area?: number;
    uncovered_area?: number;
    total_area?: number;
    rooms_count?: number;
    bedrooms_count?: number;
    bathrooms_count?: number;
    toilets_count?: number;
    parking_spaces_count?: number;
    floors_count?: number;
    zoning?: string;
    property_type_id: number;
    property_status_id: number;
    owner_id?: number;
    situation_id?: number;
    age_id?: number;
    orientation_id?: number;
    disposition_id?: number;
}

export interface PropertyFilters {
    property_type_id?: number;
    property_status_id?: number;
    visibility_status_id?: number;
    owner_id?: number;
    captured_by_user_id?: number;
    city_id?: number;
    min_price?: number;
    max_price?: number;
    operation_type_id?: number;
    currency_type_id?: number;
    featured_web?: boolean;
    search?: string;
    includeArchived?: boolean;
    limit?: number;
    offset?: number;
}

export class PropertyModel {
    private static readonly TABLE_NAME = 'properties';

    static async create(propertyData: CreatePropertyDto): Promise<Property> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: SqlParams = [];
        const placeholders: string[] = [];
        let paramIndex = 1;
        fields.push('title');
        values.push(propertyData.title);
        placeholders.push(`$${paramIndex++}`);

        fields.push('visibility_status_id');
        values.push(propertyData.visibility_status_id);
        placeholders.push(`$${paramIndex++}`);

        fields.push('captured_by_user_id');
        values.push(propertyData.captured_by_user_id);
        placeholders.push(`$${paramIndex++}`);

        fields.push('property_type_id');
        values.push(propertyData.property_type_id);
        placeholders.push(`$${paramIndex++}`);

        fields.push('property_status_id');
        values.push(propertyData.property_status_id);
        placeholders.push(`$${paramIndex++}`);

        console.log('[PropertyModel] propertyData.owner_id:', propertyData.owner_id, 'type:', typeof propertyData.owner_id);
        if (propertyData.owner_id !== undefined && propertyData.owner_id !== null) {
            console.log('[PropertyModel] Adding owner_id to INSERT:', propertyData.owner_id);
            fields.push('owner_id');
            values.push(propertyData.owner_id);
            placeholders.push(`$${paramIndex++}`);
        } else {
            console.log('[PropertyModel] owner_id is undefined or null, NOT adding to INSERT');
        }

        const addOptionalField = (fieldName: string, value: any) => {
            if (value !== undefined && value !== null && value !== '') {
                fields.push(fieldName);
                values.push(value);
                placeholders.push(`$${paramIndex++}`);
            }
        };

        addOptionalField('description', propertyData.description);
        addOptionalField('publication_date', propertyData.publication_date || new Date());
        addOptionalField('featured_web', propertyData.featured_web !== undefined ? propertyData.featured_web : false);
        addOptionalField('branch_name', propertyData.branch_name);
        addOptionalField('appraiser', propertyData.appraiser);
        addOptionalField('producer', propertyData.producer);
        addOptionalField('maintenance_user', propertyData.maintenance_user);
        addOptionalField('keys_location', propertyData.keys_location);
        addOptionalField('internal_comments', propertyData.internal_comments);
        addOptionalField('social_media_info', propertyData.social_media_info);
        addOptionalField('operation_commission_percentage', propertyData.operation_commission_percentage);
        addOptionalField('producer_commission_percentage', propertyData.producer_commission_percentage);
        addOptionalField('land_area', propertyData.land_area);
        addOptionalField('semi_covered_area', propertyData.semi_covered_area);
        addOptionalField('covered_area', propertyData.covered_area);
        addOptionalField('total_built_area', propertyData.total_built_area);
        addOptionalField('uncovered_area', propertyData.uncovered_area);
        addOptionalField('total_area', propertyData.total_area);
        addOptionalField('rooms_count', propertyData.rooms_count);
        addOptionalField('bedrooms_count', propertyData.bedrooms_count);
        addOptionalField('bathrooms_count', propertyData.bathrooms_count);
        addOptionalField('toilets_count', propertyData.toilets_count);
        addOptionalField('parking_spaces_count', propertyData.parking_spaces_count);
        addOptionalField('floors_count', propertyData.floors_count);
        addOptionalField('zoning', propertyData.zoning);
        addOptionalField('situation_id', propertyData.situation_id);
        addOptionalField('age_id', propertyData.age_id);
        addOptionalField('orientation_id', propertyData.orientation_id);
        addOptionalField('disposition_id', propertyData.disposition_id);
        
        fields.push('updated_at');
        placeholders.push('CURRENT_TIMESTAMP');

        const query = `
            INSERT INTO ${this.TABLE_NAME} (${fields.join(', ')})
            VALUES (${placeholders.join(', ')})
            RETURNING *
        `;
        
        const result = await client.query(query, values);
        return result.rows[0];
    }

    static async findById(id: number, includeArchived: boolean = false): Promise<Property | null> {
        const client = PostgresDatabase.getClient();
        let query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        
        if (!includeArchived) {
            query += ` AND visibility_status_id != (SELECT id FROM visibility_statuses WHERE name = 'Archivada')`;
        }
        
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByIdWithRelations(id: number, includeArchived: boolean = false): Promise<any | null> {
        const property = await this.findById(id, includeArchived);
        if (!property || !property.id) {
            return null;
        }

        const { PropertyAddressModel } = await import('./property-address.model');
        const { AddressModel } = await import('./address.model');
        const propertyAddresses = await PropertyAddressModel.findByPropertyId(property.id);
        const addresses = await Promise.all(
            propertyAddresses.map(pa => AddressModel.findById(pa.address_id))
        );

        const { PropertyPriceModel } = await import('./property-price.model');
        const prices = await PropertyPriceModel.findByPropertyId(property.id);

        const { PropertyMultimediaModel } = await import('./property-multimedia.model');
        const images = await PropertyMultimediaModel.findByPropertyId(property.id);

        return {
            ...property,
            addresses: addresses.filter(a => a !== null),
            prices,
            images,
        };
    }

    static async findAll(filters?: PropertyFilters): Promise<any[]> {
        const client = PostgresDatabase.getClient();
        
        let query = `
            SELECT 
                p.*,
                -- Catálogos principales
                pt.name as property_type_name,
                ps.name as property_status_name,
                vs.name as visibility_status_name,
                -- Catálogos opcionales
                pa_cat.name as property_age_name,
                o.name as orientation_name,
                d.name as disposition_name,
                psit.name as situation_name,
                -- Owner básico
                c.first_name || ' ' || c.last_name as owner_name,
                c.email as owner_email,
                c.phone as owner_phone,
                -- Imagen principal (subquery)
                (SELECT file_path FROM property_multimedia 
                 WHERE property_id = p.id AND is_primary = true 
                 LIMIT 1) as primary_image_path,
                (SELECT id FROM property_multimedia 
                 WHERE property_id = p.id AND is_primary = true 
                 LIMIT 1) as primary_image_id,
                -- Precio principal (más reciente de Venta, o el más reciente)
                (SELECT price FROM property_prices 
                 WHERE property_id = p.id 
                 ORDER BY 
                     CASE WHEN operation_type_id = (SELECT id FROM property_operation_types WHERE name = 'Venta' LIMIT 1) THEN 0 ELSE 1 END,
                     updated_at DESC 
                 LIMIT 1) as main_price,
                (SELECT currency_type_id FROM property_prices 
                 WHERE property_id = p.id 
                 ORDER BY 
                     CASE WHEN operation_type_id = (SELECT id FROM property_operation_types WHERE name = 'Venta' LIMIT 1) THEN 0 ELSE 1 END,
                     updated_at DESC 
                 LIMIT 1) as main_currency_type_id,
                (SELECT operation_type_id FROM property_prices 
                 WHERE property_id = p.id 
                 ORDER BY 
                     CASE WHEN operation_type_id = (SELECT id FROM property_operation_types WHERE name = 'Venta' LIMIT 1) THEN 0 ELSE 1 END,
                     updated_at DESC 
                 LIMIT 1) as main_operation_type_id,
                -- Dirección principal
                (SELECT a.full_address FROM property_addresses pa_addr 
                 JOIN addresses a ON pa_addr.address_id = a.id 
                 WHERE pa_addr.property_id = p.id 
                 LIMIT 1) as main_address,
                (SELECT a.neighborhood FROM property_addresses pa_addr 
                 JOIN addresses a ON pa_addr.address_id = a.id 
                 WHERE pa_addr.property_id = p.id 
                 LIMIT 1) as main_neighborhood,
                (SELECT ci.name FROM property_addresses pa_addr 
                 JOIN addresses a ON pa_addr.address_id = a.id 
                 JOIN cities ci ON a.city_id = ci.id 
                 WHERE pa_addr.property_id = p.id 
                 LIMIT 1) as main_city_name,
                (SELECT ci.id FROM property_addresses pa_addr 
                 JOIN addresses a ON pa_addr.address_id = a.id 
                 JOIN cities ci ON a.city_id = ci.id 
                 WHERE pa_addr.property_id = p.id 
                 LIMIT 1) as main_city_id,
                (SELECT pr.name FROM property_addresses pa_addr 
                 JOIN addresses a ON pa_addr.address_id = a.id 
                 JOIN cities ci ON a.city_id = ci.id 
                 JOIN provinces pr ON ci.province_id = pr.id 
                 WHERE pa_addr.property_id = p.id 
                 LIMIT 1) as main_province_name,
                -- Contador de imágenes
                (SELECT COUNT(*) FROM property_multimedia WHERE property_id = p.id) as images_count
            FROM ${this.TABLE_NAME} p
            LEFT JOIN property_types pt ON p.property_type_id = pt.id
            LEFT JOIN property_statuses ps ON p.property_status_id = ps.id
            LEFT JOIN visibility_statuses vs ON p.visibility_status_id = vs.id
            LEFT JOIN property_ages pa_cat ON p.age_id = pa_cat.id
            LEFT JOIN orientations o ON p.orientation_id = o.id
            LEFT JOIN dispositions d ON p.disposition_id = d.id
            LEFT JOIN property_situations psit ON p.situation_id = psit.id
            LEFT JOIN clients c ON p.owner_id = c.id
        `;
        
        const conditions: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        let needsPriceJoin = false;
        if (filters?.min_price || filters?.max_price || filters?.operation_type_id || filters?.currency_type_id) {
            query += ` LEFT JOIN property_prices pp ON p.id = pp.property_id`;
            needsPriceJoin = true;
        }

        let needsAddressJoin = false;
        if (filters?.city_id) {
            query += ` LEFT JOIN property_addresses pa ON p.id = pa.property_id LEFT JOIN addresses a ON pa.address_id = a.id`;
            needsAddressJoin = true;
        }

        if (filters) {
            if (filters.property_type_id !== undefined) {
                conditions.push(`p.property_type_id = $${paramIndex++}`);
                values.push(filters.property_type_id);
            }
            if (filters.property_status_id !== undefined) {
                conditions.push(`p.property_status_id = $${paramIndex++}`);
                values.push(filters.property_status_id);
            }
            if (filters.visibility_status_id !== undefined) {
                conditions.push(`p.visibility_status_id = $${paramIndex++}`);
                values.push(filters.visibility_status_id);
            }
            if (filters.owner_id !== undefined) {
                conditions.push(`p.owner_id = $${paramIndex++}`);
                values.push(filters.owner_id);
            }
            if (filters.captured_by_user_id !== undefined) {
                conditions.push(`p.captured_by_user_id = $${paramIndex++}`);
                values.push(filters.captured_by_user_id);
            }
            if (filters.city_id !== undefined) {
                conditions.push(`a.city_id = $${paramIndex++}`);
                values.push(filters.city_id);
            }
            if (filters.featured_web !== undefined) {
                conditions.push(`p.featured_web = $${paramIndex++}`);
                values.push(filters.featured_web);
            }
            if (filters.min_price !== undefined) {
                conditions.push(`pp.price >= $${paramIndex++}`);
                values.push(filters.min_price);
            }
            if (filters.max_price !== undefined) {
                conditions.push(`pp.price <= $${paramIndex++}`);
                values.push(filters.max_price);
            }
            if (filters.operation_type_id !== undefined) {
                conditions.push(`pp.operation_type_id = $${paramIndex++}`);
                values.push(filters.operation_type_id);
            }
            if (filters.currency_type_id !== undefined) {
                conditions.push(`pp.currency_type_id = $${paramIndex++}`);
                values.push(filters.currency_type_id);
            }
            if (filters.search) {
                conditions.push(`(p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
                values.push(`%${filters.search}%`);
                paramIndex++;
            }
        }

        if (!filters?.includeArchived) {
            conditions.push(`p.visibility_status_id != (SELECT id FROM visibility_statuses WHERE name = 'Archivada')`);
        }
        
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        if (needsPriceJoin || needsAddressJoin) {
            query += ` GROUP BY p.id, pt.name, ps.name, vs.name, pa_cat.name, o.name, d.name, psit.name, c.first_name, c.last_name, c.email, c.phone`;
        }

        query += ` ORDER BY p.publication_date DESC, p.updated_at DESC`;

        if (filters?.limit) {
            query += ` LIMIT $${paramIndex++}`;
            values.push(filters.limit);
            if (filters.offset) {
                query += ` OFFSET $${paramIndex++}`;
                values.push(filters.offset);
            }
        }

        const result = await client.query(query, values);
        return result.rows;
    }

    static async update(id: number, updateData: Partial<CreatePropertyDto>): Promise<Property | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        const addField = (field: string, value: any) => {
            if (value !== undefined) {
                fields.push(`${field} = $${paramIndex++}`);
                values.push(value);
            }
        };

        addField('title', updateData.title);
        addField('description', updateData.description);
        addField('publication_date', updateData.publication_date);
        addField('featured_web', updateData.featured_web);
        addField('visibility_status_id', updateData.visibility_status_id);
        addField('captured_by_user_id', updateData.captured_by_user_id);
        addField('branch_name', updateData.branch_name);
        addField('appraiser', updateData.appraiser);
        addField('producer', updateData.producer);
        addField('maintenance_user', updateData.maintenance_user);
        addField('keys_location', updateData.keys_location);
        addField('internal_comments', updateData.internal_comments);
        addField('social_media_info', updateData.social_media_info);
        addField('operation_commission_percentage', updateData.operation_commission_percentage);
        addField('producer_commission_percentage', updateData.producer_commission_percentage);
        addField('land_area', updateData.land_area);
        addField('semi_covered_area', updateData.semi_covered_area);
        addField('covered_area', updateData.covered_area);
        addField('total_built_area', updateData.total_built_area);
        addField('uncovered_area', updateData.uncovered_area);
        addField('total_area', updateData.total_area);
        addField('rooms_count', updateData.rooms_count);
        addField('bedrooms_count', updateData.bedrooms_count);
        addField('bathrooms_count', updateData.bathrooms_count);
        addField('toilets_count', updateData.toilets_count);
        addField('parking_spaces_count', updateData.parking_spaces_count);
        addField('floors_count', updateData.floors_count);
        addField('zoning', updateData.zoning);
        addField('property_type_id', updateData.property_type_id);
        addField('property_status_id', updateData.property_status_id);
        addField('owner_id', updateData.owner_id);
        addField('situation_id', updateData.situation_id);
        addField('age_id', updateData.age_id);
        addField('orientation_id', updateData.orientation_id);
        addField('disposition_id', updateData.disposition_id);

        if (fields.length === 0) {
            return await this.findById(id);
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE ${this.TABLE_NAME}
            SET ${fields.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

        const result = await client.query(query, values);
        return result.rows[0] || null;
    }

    static async archive(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        
        const statusQuery = `SELECT id FROM visibility_statuses WHERE name = 'Archivada' LIMIT 1`;
        const statusResult = await client.query(statusQuery);
        
        if (statusResult.rows.length === 0) {
            throw new Error('Visibility status "Archivada" not found. Run: npm run db:seed-catalogs');
        }
        
        const archivedStatusId = statusResult.rows[0].id;
        
        const query = `
            UPDATE ${this.TABLE_NAME} 
            SET visibility_status_id = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2 
            RETURNING id
        `;
        const result = await client.query(query, [archivedStatusId, id]);
        return (result.rowCount ?? 0) > 0;
    }


    static async unarchive(id: number, newVisibilityStatusId?: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        
        let visibilityStatusId = newVisibilityStatusId;
        
        if (!visibilityStatusId) {
            const statusQuery = `SELECT id FROM visibility_statuses WHERE name = 'Publicado' LIMIT 1`;
            const statusResult = await client.query(statusQuery);
            
            if (statusResult.rows.length === 0) {
                throw new Error('Visibility status "Publicado" not found. Run: npm run db:seed-catalogs');
            }
            
            visibilityStatusId = statusResult.rows[0].id;
        }
        
        const query = `
            UPDATE ${this.TABLE_NAME} 
            SET visibility_status_id = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2 
            RETURNING id
        `;
        const result = await client.query(query, [visibilityStatusId, id]);
        return (result.rowCount ?? 0) > 0;
    }

    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

