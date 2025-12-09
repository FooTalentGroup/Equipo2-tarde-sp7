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
