"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import { api } from "@src/lib/axios";
import type {
	Property,
	PropertyForm,
	PropertyResponse,
} from "@src/types/property";
import type {
	PropertyDetail,
	PropertyDocument,
	PropertyImage,
} from "@src/types/property-detail";

import { PROPERTY_TYPE } from "../consts";

export async function getProperties(
	options: {
		includeArchived?: boolean;
		token?: string;
		property_type_id?: string;
		min_price?: string;
		max_price?: string;
		search?: string;
		operation_type_id?: string;
		featured_web?: boolean;
	} = {},
) {
	const {
		includeArchived = false,
		token,
		property_type_id,
		min_price,
		max_price,
		search,
		operation_type_id,
		featured_web,
	} = options;

	const filters = {
		...(includeArchived && { includeArchived: "true" }),
		...(property_type_id && { property_type_id }),
		...(min_price && { min_price }),
		...(max_price && { max_price }),
		...(search && { search }),
		...(operation_type_id && { operation_type_id }),
		...(featured_web && { featured_web: "true" }),
	};

	const getCachedProperties = unstable_cache(
		async () => {
			try {
				const headers: Record<string, string> = token
					? { Authorization: `Bearer ${token}` }
					: {};

				const data = await api.get<PropertyResponse>("properties", {
					params: filters,
					headers,
					skipAuth: !token,
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

export async function getPropertyById(
	id: number,
	options: { includeArchived?: boolean; token?: string } = {},
) {
	const { includeArchived = true, token } = options;
	try {
		const headers: Record<string, string> = token
			? { Authorization: `Bearer ${token}` }
			: {};

		const data = await api.get<{ property: PropertyDetail }>(
			`properties/${id}`,
			{
				params: { includeArchived },
				headers,
				skipAuth: !token,
			},
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
			data.images.gallery.forEach((file: File | PropertyImage) => {
				if (file instanceof File && !("id" in file)) {
					formData.append("images", file);
				}
			});
		}

		if (data.documents?.files && data.documents.files.length > 0) {
			data.documents.files.forEach((file: File | PropertyDocument) => {
				if (file instanceof File) {
					formData.append("documents", file);
				}
			});
		}

		const res = await api.post<Property>("properties/grouped", formData);
		revalidateTag("properties", { expire: 0 });
		revalidatePath("/agent/properties");
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
			data.images.gallery.forEach((file: File | PropertyImage) => {
				if (file instanceof File && !("id" in file)) {
					formData.append("images", file);
				}
			});
		}

		const imageOrder = data.images?.gallery
			?.filter((f: File | PropertyImage): f is PropertyImage => "id" in f)
			.map((f, index) => ({
				id: f.id,
				is_primary: index === 0,
			}));

		if (imageOrder && imageOrder.length > 0) {
			formData.append("imageOrder", JSON.stringify(imageOrder));
		}

		if (data.documents?.files && data.documents.files.length > 0) {
			data.documents.files.forEach((file: File | PropertyDocument) => {
				if (file instanceof File) {
					formData.append("documents", file);
				}
			});
		}

		const res = await api.patch<Property>(`properties/${id}/grouped`, formData);
		revalidateTag("properties", { expire: 0 });
		revalidatePath(`/agent/properties/${id}`);
		revalidatePath(`/agent/properties/${id}/edit`);
		revalidatePath("/agent/properties");
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
		revalidatePath("/agent/properties");
		return { success: true };
	} catch (error) {
		console.error("Error deleting property:", error);
		return { success: false, error };
	}
}

export async function archiveProperty(id: number) {
	try {
		await api.post(`properties/${id}/archive`, {});
		revalidateTag("properties", { expire: 0 });
		revalidatePath(`/agent/properties/${id}`);
		revalidatePath("/agent/properties");
		return { success: true };
	} catch (error) {
		console.error("Error archiving property:", error);
		return { success: false, error };
	}
}

export async function unarchiveProperty(id: number) {
	try {
		await api.post(`properties/${id}/unarchive`, {});
		revalidateTag("properties", { expire: 0 });
		revalidatePath(`/agent/properties/${id}`);
		revalidatePath("/agent/properties");
		return { success: true };
	} catch (error) {
		console.error("Error unarchiving property:", error);
		return { success: false, error };
	}
}

export async function toggleFeaturedProperty(
	id: number,
	featured_web: boolean,
) {
	try {
		await api.patch(`properties/${id}/toggle-featured`, { featured_web });
		revalidateTag("properties", { expire: 0 });
		revalidatePath(`/agent/properties/${id}`);
		revalidatePath("/agent/properties");
		return { success: true };
	} catch (error) {
		console.error("Error toggling featured property:", error);
		return { success: false, error };
	}
}

export async function getDocumentDownloadUrl(documentId: number) {
	try {
		const res = await api.get<{ document: { download_url: string } }>(
			`properties/documents/${documentId}/download-url`,
		);
		return { success: true, url: res.document.download_url };
	} catch (error) {
		console.error("Error getting document download url:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Error desconocido",
		};
	}
}
