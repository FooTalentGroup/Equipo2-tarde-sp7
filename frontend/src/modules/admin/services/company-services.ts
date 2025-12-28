"use server";

import { api } from "@src/lib/axios";

type CompanySettings = {
	logo_url: string;
	company_name: string;
};

export async function getCompanySettings(): Promise<CompanySettings | null> {
	try {
		const response = await api.get<CompanySettings>("company/settings");
		return response;
	} catch (error) {
		console.error("Error al obtener la configuración de la compañía:", error);
		return null;
	}
}

export async function updateCompanyLogo(formData: FormData): Promise<{
	success: boolean;
	data?: CompanySettings;
	error?: string;
}> {
	try {
		const response = await api.patch<CompanySettings>("company/logo", formData);

		return {
			success: true,
			data: response,
		};
	} catch (error) {
		console.error("Error al actualizar el logo:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Error al subir el logo",
		};
	}
}
