"use server";

import { api } from "@src/lib/axios";
import type { Client } from "@src/types/client";

export async function getClients() {
	try {
		const data = await api.get<{ clients: Client[]; count: number }>("clients");
		return data;
	} catch (error) {
		console.error("Error fetching clients:", error);
		return { clients: [], count: 0 };
	}
}
