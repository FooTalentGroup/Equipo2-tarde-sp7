"use server";

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
