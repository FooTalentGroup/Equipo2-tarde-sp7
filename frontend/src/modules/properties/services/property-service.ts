"use server";

import { api } from "@src/lib/axios";
import type { Property } from "@src/types/property";

export async function getProperties(
	filters?: Record<string, string | number | boolean | undefined | null>,
) {
	const data = await api.get<Property[]>("properties", { params: filters });
	return data;
}

export async function getPropertyBySlug(slug: string) {
	const data = await api.get<Property>(`properties/${slug}`);
	return data;
}

export async function createProperty(formData: FormData) {
	try {
		const data = await api.post("properties/grouped", formData);
		return data;
	} catch (error) {
		return {
			error:
				error instanceof Error ? error.message : "Error al crear la propiedad",
		};
	}
}
