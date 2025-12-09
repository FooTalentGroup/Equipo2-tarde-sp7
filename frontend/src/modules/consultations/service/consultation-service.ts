"use server";

import { api } from "@src/lib/axios";
import type { Consultation } from "@src/types/consultations";

import type { ConsultationFilterForm } from "../types/consultation-filter";

export async function getConsultations(filters: ConsultationFilterForm) {
	const params = new URLSearchParams();

	if (filters.start_date) params.append("start_date", filters.start_date);
	if (filters.end_date) params.append("end_date", filters.end_date);
	if (filters.is_read !== undefined)
		params.append("is_read", String(filters.is_read));
	if (filters.consultation_type_id)
		params.append("consultation_type_id", String(filters.consultation_type_id));
	if (filters.limit) params.append("limit", String(filters.limit));
	if (filters.offset) params.append("offset", String(filters.offset));

	const queryString = params.toString();
	const url = queryString ? `/consultations?${queryString}` : `/consultations`;

	const response = await api.get<{
		consultations: Consultation[];
		pagination: {
			total: number;
			limit: number;
			offset: number;
			hasMore: boolean;
		};
	}>(url);

	// Extrae el array de consultations y el total de pagination
	const consultations = response.consultations || [];
	const total = response.pagination?.total || consultations.length;

	return { data: consultations, total };
}
/* export async function markConsultationAsRead(id: number, token?: string) {
	return api.patch(`/consultations/${id}/read`, null, {
		headers: { Authorization: `Bearer ${token}` },
	});
} */

export async function markConsultationAsRead(id: number) {
	return api.patch(`/consultations/${id}/read`, null);
}

export async function deleteConsultation(id: number, token?: string) {
	return api.delete(`/consultations/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
}

export async function deleteAllConsultations(token?: string) {
	return api.delete(`/consultations`, {
		headers: { Authorization: `Bearer ${token}` },
	});
}
