import { ContactCategory } from "@src/enums/contact-category";

export const CONTACT_CATEGORY_LABELS: Record<ContactCategory, string> = {
	[ContactCategory.LEAD]: "Lead",
	[ContactCategory.TENANT]: "Inquilino",
	[ContactCategory.OWNER]: "Propietario",
	[ContactCategory.INVESTOR]: "Inversor",
};
