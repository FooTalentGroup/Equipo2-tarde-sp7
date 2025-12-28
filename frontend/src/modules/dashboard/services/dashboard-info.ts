"use server";

import { api } from "@src/lib/axios";
import { toast } from "sonner";

type DashboardStats = {
	active_properties: number;
	inactive_properties: number;
	unanswered_consultations: number;
	new_leads_today: number;
};

type DashboardResponse = {
	data: {
		stats: DashboardStats;
	};
};

export async function getDashboardInfo(): Promise<DashboardStats | null> {
	try {
		const response = await api.get<DashboardResponse>("/dashboard");
		return response.data.stats;
	} catch (error) {
		console.error("Error fetching dashboard info:", error);
		toast.error("Error al obtener la información del dashboard");
		return null;
	}
}
