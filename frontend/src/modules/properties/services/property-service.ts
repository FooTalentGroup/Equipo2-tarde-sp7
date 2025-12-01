"use server";

import { api } from "@src/lib/axios";
import type { Client } from "@src/types/client";
import type { Property, PropertyResponse } from "@src/types/property";

export async function getProperties(
	filters?: Record<string, string | number | boolean | undefined | null>,
) {
	const data = await api.get<PropertyResponse>("properties", {
		params: filters,
	});
	return data;
}

export async function getPropertyBySlug(slug: string) {
	const data = await api.get<Property>(`properties/${slug}`);
	return data;
}

export async function createProperty(formData: FormData) {
	try {
		console.log("formData", formData);
		const res = await api.post<Property>("properties/grouped", formData);
		return res;
	} catch (error) {
		console.log("error", error);
		return {
			error:
				error instanceof Error ? error.message : "Error al crear la propiedad",
		};
	}
}

export async function getClients() {
	const data = await api.get<{ clients: Client[]; count: number }>("clients");
	return data;
}

export async function getPropertyTypes() {
	const data = await api.get<{ id: string; title: string }[]>("property-types");
	return data;
}
