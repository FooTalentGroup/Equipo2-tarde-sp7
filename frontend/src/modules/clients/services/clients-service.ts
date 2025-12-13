"use server";

import { revalidatePath } from "next/cache";

import { api } from "@src/lib/axios";
import { getToken } from "@src/modules/auth/lib/session";

import type { ClientData, ClientResponse } from "./types";
import { CLIENT_TYPE_CONFIG, type ClientType } from "./types";

export async function createClientServerAction<T extends ClientResponse>(
	clientType: ClientType,
	data: ClientData,
): Promise<T> {
	const token = await getToken();

	if (!token) {
		throw new Error("No autenticado. Inicia sesión para crear clientes.");
	}

	const config = CLIENT_TYPE_CONFIG[clientType];

	try {
		return await api.post<T>(config.url, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`${config.errorMessage}. Detalle: ${message}`);
	}
}

export async function getClients<T = ClientResponse>(
	endpoint: string = "clients",
	filters?: Record<string, string | number | boolean | undefined | null>,
): Promise<{ clients: T[]; count: number }> {
	try {
		const data = await api.get<{ clients: T[]; count: number }>(endpoint, {
			params: filters,
		});
		return data;
	} catch (error) {
		console.error(`Error fetching clients from ${endpoint}:`, error);
		return { clients: [] as T[], count: 0 };
	}
}

export async function getClientById<T = ClientResponse>(
	id: string,
): Promise<T | null> {
	try {
		const data = await api.get<T>(`clients/${id}`);
		return data;
	} catch (error) {
		console.error(`Error fetching client with id ${id}:`, error);
		return null;
	}
}

export async function deleteClientById<T = ClientResponse>(
	id: string,
): Promise<T | null> {
	try {
		const data = await api.delete<T>(`clients/${id}`);
		return data;
	} catch (error) {
		console.error(`Error deleting client with id ${id}:`, error);
		return null;
	}
}

export async function updateClientById<T = ClientResponse>(
	id: string,
	data: Partial<ClientData>,
): Promise<T | null> {
	try {
		const response = await api.patch<T>(`clients/${id}`, data);
		return response;
	} catch (error) {
		console.error(`Error updating client with id ${id}:`, error);
		return null;
	}
}

export async function addPropertyOfInterest(
	clientId: string | number,
	propertyId: string | number,
): Promise<boolean> {
	try {
		console.log("Calling addPropertyOfInterest:", { clientId, propertyId });
		const response = await api.post(
			`/clients/${clientId}/properties-of-interest`,
			{
				property_id: Number(propertyId),
			},
		);
		console.log("Response:", response);
		revalidatePath("/agent/consultations");
		return true;
	} catch (error) {
		console.error(
			`Error adding property of interest for client ${clientId}:`,
			error,
		);
		return false;
	}
}

export async function getClientPropertiesOfInterest(
	clientId: string | number,
): Promise<number[]> {
	try {
		const response = await api.get<{
			properties_of_interest: Array<{ id: number }>;
		}>(`/clients/${clientId}`);
		return response.properties_of_interest?.map((prop) => prop.id) || [];
	} catch (error) {
		console.error(
			`Error getting properties of interest for client ${clientId}:`,
			error,
		);
		return [];
	}
}

export async function addOwnedProperty(
	clientId: string | number,
	propertyId: string | number,
): Promise<boolean> {
	try {
		await api.post(`clients/${clientId}/owned-properties`, {
			property_id: Number(propertyId),
		});
		return true;
	} catch (error) {
		console.error(`Error adding owned property for client ${clientId}:`, error);
		return false;
	}
}

export async function removePropertyOfInterest(
	clientId: string | number,
	propertyId: string | number,
): Promise<boolean> {
	try {
		await api.delete(
			`clients/${clientId}/properties-of-interest/${propertyId}`,
		);
		return true;
	} catch (error) {
		console.error(
			`Error removing property of interest for client ${clientId}:`,
			error,
		);
		return false;
	}
}

export async function removeOwnedProperty(
	clientId: string | number,
	propertyId: string | number,
): Promise<boolean> {
	try {
		await api.delete(`clients/${clientId}/owned-properties/${propertyId}`);
		return true;
	} catch (error) {
		console.error(
			`Error removing owned property for client ${clientId}:`,
			error,
		);
		return false;
	}
}
