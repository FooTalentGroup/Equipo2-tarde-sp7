"use server";

import { api } from "@src/lib/axios";
import type { Owner } from "@src/types/clients/owner";

export async function getClients(
	filters?: Record<string, string | number | boolean | undefined | null>,
) {
	try {
		const data = await api.get<{ clients: Owner[]; count: number }>("clients", {
			params: filters,
		});
		return data;
	} catch (error) {
		console.error("Error fetching clients:", error);
		return { clients: [], count: 0 };
	}
}
