"use server";

import { api } from "@src/lib/axios";

export interface CreateConsultationPayload {
	property_id: number;
	first_name: string;
	last_name: string;
	phone: string;
	message: string;
	email: string;
}

export interface CreateGeneralConsultationPayload {
	first_name: string;
	last_name: string;
	phone: string;
	message: string;
	email: string;
}

export interface ConsultationResponse {
	success: boolean;
	message: string;
	data?: unknown;
}

export async function createPropertyConsultation(
	payload: CreateConsultationPayload,
): Promise<ConsultationResponse> {
	try {
		const response = await api.post("/consultations/property", payload);
		return {
			success: true,
			message: "Consulta enviada correctamente",
			data: response,
		};
	} catch (error) {
		console.error("Error creating property consultation:", error);
		const errorMessage =
			error instanceof Error
				? error.message
				: "Ocurrió un error al enviar la consulta. Por favor intente nuevamente.";
		return {
			success: false,
			message: errorMessage,
		};
	}
}

export async function createGeneralConsultation(
	payload: CreateGeneralConsultationPayload,
): Promise<ConsultationResponse> {
	try {
		const response = await api.post("/consultations/general", payload);
		return {
			success: true,
			message: "Consulta enviada correctamente",
			data: response,
		};
	} catch (error) {
		console.error("Error creating general consultation:", error);
		const errorMessage =
			error instanceof Error
				? error.message
				: "Ocurrió un error al enviar la consulta. Por favor intente nuevamente.";
		return {
			success: false,
			message: errorMessage,
		};
	}
}
