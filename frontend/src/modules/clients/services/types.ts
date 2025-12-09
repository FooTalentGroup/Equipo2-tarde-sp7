import type { CreateLead, Lead } from "@src/types/clients/lead";
import type { CreateOwner, Owner } from "@src/types/clients/owner";
import type { CreateTenant, Tenant } from "@src/types/clients/tenant";

export enum ClientType {
	LEAD = "leads",
	OWNER = "owners",
	TENANT = "tenants",
}

export type ClientData = CreateLead | CreateOwner | CreateTenant;
export type ClientResponse = Lead | Owner | Tenant;

export interface ClientTypeConfig {
	url: string;
	errorMessage: string;
}

export const CLIENT_TYPE_CONFIG: Record<ClientType, ClientTypeConfig> = {
	[ClientType.LEAD]: {
		url: "clients/leads",
		errorMessage: "No se pudo crear el lead",
	},
	[ClientType.OWNER]: {
		url: "clients/owners",
		errorMessage: "No se pudo crear el propietario",
	},
	[ClientType.TENANT]: {
		url: "clients/tenants",
		errorMessage: "No se pudo crear el inquilino",
	},
};
