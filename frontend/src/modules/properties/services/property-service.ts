"use server";

import { api } from "@src/lib/axios";
import type {
	Property,
	PropertyForm,
	PropertyResponse,
} from "@src/types/property";

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

export async function createProperty(data: PropertyForm) {
	try {
		const formData = new FormData();

		formData.append("basic", JSON.stringify(data.basic));
		formData.append("geography", JSON.stringify(data.geography));
		formData.append("address", JSON.stringify(data.address));
		formData.append("values", JSON.stringify(data.values));
		formData.append("characteristics", JSON.stringify(data.characteristics));
		formData.append("surface", JSON.stringify(data.surface));
		formData.append("services", JSON.stringify(data.services));
		formData.append("internal", JSON.stringify(data.internal));

		if (data.images?.gallery && data.images.gallery.length > 0) {
			data.images.gallery.forEach((file: File) => {
				formData.append("images", file);
			});
		}

		if (data.documents?.files && data.documents.files.length > 0) {
			data.documents.files.forEach((file: File) => {
				formData.append("documents", file);
			});
		}

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

export async function getPropertyTypes() {
	const data = await api.get<{ id: string; title: string }[]>("property-types");
	return data;
}
