/* // @src/services/clients-service.ts
import { api } from "@src/lib/axios";
import type { CreateLead, Lead } from "@src/types/clients/lead";

const BASE_URL = "clients";

export async function createLead(data: CreateLead): Promise<Lead> {
  try {
    return await api.post<Lead>(BASE_URL, data);
  } catch (error) {
    console.error("Error creating lead:", error);
    throw new Error("No se pudo crear el lead.");
  }
}
 */

// ✔ 1) Hacemos que este archivo sea un SERVER ACTION puro
"use server";

import { api } from "@src/lib/axios";
import { getToken } from "@src/modules/auth/lib/session";
import type { CreateLead, Lead } from "@src/types/clients/lead";

const BASE_URL = "clients/leads";

// Server Action: enviar petición al endpoint actualizado
export async function createLeadServerAction(data: CreateLead): Promise<Lead> {
	const token = await getToken();

	if (!token) {
		throw new Error("No autenticado. Inicia sesión para crear leads.");
	}

	try {
		return await api.post<Lead>(BASE_URL, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`No se pudo crear el lead. Detalle: ${message}`);
	}
}
