"use server";

import { api } from "@src/lib/axios";
import type { CompanySettings } from "@src/types/company-settings";

export async function getCompanySettings() {
	try {
		const data = await api.get<CompanySettings>("company/settings");
		return data;
	} catch (error) {
		console.error("Error fetching company settings:", error);
		return null;
	}
}
