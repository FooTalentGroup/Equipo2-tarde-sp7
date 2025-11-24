import { LeadModel, PropertyModel, ProfileModel } from "../../data/postgres/models";
import { LeadEntity, CreateLeadDto, CustomError, UpdateLeadDto } from "../../domain";

export class LeadServices {
    public async createLead(createLeadDto: CreateLeadDto) {
        try {
            // Verificar que el status existe (debería validarse contra LeadStatusModel)
            // Por ahora lo omitimos para simplificar
            
            // Verificar que la propiedad existe (si se proporciona)
            if (createLeadDto.property_id) {
                const property = await PropertyModel.findById(createLeadDto.property_id);
                if (!property) {
                    throw CustomError.notFound('Property not found');
                }
            }
            
            // Verificar que el perfil existe (si se proporciona)
            if (createLeadDto.profile_id) {
                const profile = await ProfileModel.findById(createLeadDto.profile_id);
                if (!profile) {
                    throw CustomError.notFound('Profile not found');
                }
            }
            
            // Crear lead en la base de datos
            const lead = await LeadModel.create({
                property_id: createLeadDto.property_id,
                profile_id: createLeadDto.profile_id,
                origin: createLeadDto.origin,
                status_id: createLeadDto.status_id,
                visitor_name: createLeadDto.visitor_name,
                visitor_phone: createLeadDto.visitor_phone,
                visitor_email: createLeadDto.visitor_email,
                message: createLeadDto.message
            });

            // Convertir a Entity
            const leadEntity = LeadEntity.fromObject(lead);
            
            return leadEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating lead: ${error}`);
        }
    }

    public async getLeadById(id: string) {
        try {
            const lead = await LeadModel.findById(id);
            if (!lead) {
                throw CustomError.notFound('Lead not found');
            }
            
            const leadEntity = LeadEntity.fromObject(lead);
            return leadEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting lead: ${error}`);
        }
    }

    public async getAllLeads() {
        try {
            const leads = await LeadModel.findAll();
            return leads.map(lead => LeadEntity.fromObject(lead));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting leads: ${error}`);
        }
    }

    public async getLeadsByProperty(propertyId: string) {
        try {
            // Verificar que la propiedad existe
            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            
            const leads = await LeadModel.findByProperty(propertyId);
            return leads.map(lead => LeadEntity.fromObject(lead));
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting leads by property: ${error}`);
        }
    }

    public async updateLead(id: string, updateLeadDto: UpdateLeadDto) {
        try {
            // Verificar que el lead existe
            const existingLead = await LeadModel.findById(id);
            if (!existingLead) {
                throw CustomError.notFound('Lead not found');
            }
            
            // Verificar que la propiedad existe (si se está actualizando)
            if (updateLeadDto.property_id) {
                const property = await PropertyModel.findById(updateLeadDto.property_id);
                if (!property) {
                    throw CustomError.notFound('Property not found');
                }
            }
            
            // Verificar que el perfil existe (si se está actualizando)
            if (updateLeadDto.profile_id) {
                const profile = await ProfileModel.findById(updateLeadDto.profile_id);
                if (!profile) {
                    throw CustomError.notFound('Profile not found');
                }
            }
            
            // Actualizar lead
            const updatedLead = await LeadModel.update(id, {
                property_id: updateLeadDto.property_id,
                profile_id: updateLeadDto.profile_id,
                origin: updateLeadDto.origin,
                status_id: updateLeadDto.status_id,
                visitor_name: updateLeadDto.visitor_name,
                visitor_phone: updateLeadDto.visitor_phone,
                visitor_email: updateLeadDto.visitor_email,
                message: updateLeadDto.message
            });
            
            if (!updatedLead) {
                throw CustomError.notFound('Lead not found');
            }
            
            const leadEntity = LeadEntity.fromObject(updatedLead);
            return leadEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating lead: ${error}`);
        }
    }

    public async deleteLead(id: string) {
        try {
            // Verificar que el lead existe
            const existingLead = await LeadModel.findById(id);
            if (!existingLead) {
                throw CustomError.notFound('Lead not found');
            }
            
            const deleted = await LeadModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Lead not found');
            }
            
            return { message: 'Lead deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting lead: ${error}`);
        }
    }
}

