import type { BaseContact } from "./base";

export interface CreateOwner extends BaseContact {
	contact_category: "Propietario";
	address: string;
}

export interface Owner extends CreateOwner {
	id: string;
	created_at: string;
	updated_at: string;
}

export type UpdateOwner = Partial<CreateOwner>;
