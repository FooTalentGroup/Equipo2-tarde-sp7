import type { ContactCategory } from "./base";
import type { CreateLead, Lead, UpdateLead } from "./lead";
import type { CreateOwner, Owner, UpdateOwner } from "./owner";
import type { CreateTenant, Tenant, UpdateTenant } from "./tenant";

// Tipos de unión para cuando necesites trabajar con cualquier tipo de contacto
export type CreateContact = CreateLead | CreateOwner | CreateTenant;
export type Contact = Lead | Owner | Tenant;
export type UpdateContact = UpdateLead | UpdateOwner | UpdateTenant;

// Helper type para discriminar por categoría
export type ContactByCategory<T extends ContactCategory> = T extends "Lead"
	? Lead
	: T extends "Propietario"
		? Owner
		: T extends "Inquilino"
			? Tenant
			: never;
