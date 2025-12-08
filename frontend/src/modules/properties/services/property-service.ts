"use server";

import { revalidateTag, unstable_cache } from "next/cache";

import { api } from "@src/lib/axios";
import type {
	Property,
	PropertyForm,
	PropertyResponse,
} from "@src/types/property";
import type { PropertyDetail } from "@src/types/property-detail";

import { PROPERTY_TYPE } from "../consts";

export async function getProperties(
	filters?: Record<string, string | number | boolean | undefined | null>,
	token?: string,
) {
	const getCachedProperties = unstable_cache(
		async () => {
			try {
				const headers: Record<string, string> = token
					? { Authorization: `Bearer ${token}` }
					: {};
				const data = await api.get<PropertyResponse>("properties", {
					params: filters,
					headers,
				});
				return data;
			} catch (error) {
				console.error("Error fetching properties:", error);
				return {
					count: 0,
					properties: [],
				};
			}
		},
		["properties", JSON.stringify(filters)],
		{
			tags: ["properties"],
			revalidate: 60,
		},
	);

	return getCachedProperties();
}

export async function getPropertyById(id: number) {
	try {
		const data = await api.get<{ property: PropertyDetail }>(
			`properties/${id}`,
		);
		return data;
	} catch (error) {
		if (error instanceof Error && error.message.includes("not found")) {
			return null;
		}
		console.error("Error fetching property:", error);
		return null;
	}
}

export async function createProperty(data: PropertyForm) {
	try {
		const formData = new FormData();

		const propertyTypeLabel =
			PROPERTY_TYPE.find((t) => t.value === data.basic.property_type)?.label ||
			data.basic.property_type;

		const basicData = {
			...data.basic,
			property_type: propertyTypeLabel,
		};

		formData.append("basic", JSON.stringify(basicData));
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
		revalidateTag("properties", { expire: 0 });
		return res;
	} catch (error) {
		console.log("error", error);
		return {
			error:
				error instanceof Error ? error.message : "Error al crear la propiedad",
		};
	}
}

export async function updateProperty(id: number | string, data: PropertyForm) {
	try {
		const formData = new FormData();

		const propertyTypeLabel =
			PROPERTY_TYPE.find((t) => t.value === data.basic.property_type)?.label ||
			data.basic.property_type;

		const basicData = {
			...data.basic,
			property_type: propertyTypeLabel,
		};

		formData.append("basic", JSON.stringify(basicData));
		formData.append("geography", JSON.stringify(data.geography));
		formData.append("address", JSON.stringify(data.address));
		formData.append("values", JSON.stringify(data.values));
		formData.append("characteristics", JSON.stringify(data.characteristics));
		formData.append("surface", JSON.stringify(data.surface));
		formData.append("services", JSON.stringify(data.services));
		formData.append("internal", JSON.stringify(data.internal));

		if (data.images?.gallery && data.images.gallery.length > 0) {
			data.images.gallery.forEach((file: any) => {
				if (file instanceof File && !(file as any).id) {
					formData.append("images", file);
				}
			});
		}

		const existingImageIds = data.images?.gallery
			?.filter((f: any) => f.id)
			.map((f: any) => f.id);

		if (existingImageIds && existingImageIds.length > 0) {
			formData.append("existing_images", JSON.stringify(existingImageIds));
		}

		if (data.documents?.files && data.documents.files.length > 0) {
			data.documents.files.forEach((file: any) => {
				if (file instanceof File) {
					formData.append("documents", file);
				}
			});
		}

		const res = await api.put<Property>(`properties/${id}`, formData);
		revalidateTag("properties", { expire: 0 });
		return res;
	} catch (error) {
		console.log("error", error);
		return {
			error:
				error instanceof Error
					? error.message
					: "Error al actualizar la propiedad",
		};
	}
}

export async function deleteProperty(id: number) {
	try {
		await api.delete(`properties/${id}`);
		revalidateTag("properties", { expire: 0 });
		return { success: true };
	} catch (error) {
		console.error("Error deleting property:", error);
		return { success: false, error };
	}
}

export async function archiveProperty(id: number) {
	try {
		await api.post(`properties/${id}/archive`);
		revalidateTag("properties", { expire: 0 });
		return { success: true };
	} catch (error) {
		console.error("Error archiving property:", error);
		return { success: false, error };
	}
}

export async function unarchiveProperty(id: number) {
	try {
		await api.post(`properties/${id}/unarchive`);
		revalidateTag("properties", { expire: 0 });
		return { success: true };
	} catch (error) {
		console.error("Error unarchiving property:", error);
		return { success: false, error };
	}
}
