import { ApiConnector } from "@src/lib/api";
import type { Property } from "@src/types/property";

interface ApiError {
	response?: {
		data?: {
			error?: string;
			message?: string;
		};
		status?: number;
	};
	request?: unknown;
	message?: string;
}

const root_path = "/properties/grouped";

export async function createProperty(
	_formData: FormData,
): Promise<Property | { error: string } | null> {
	try {
		// TODO: Remove hardcoded token when auth is fixed
		const token =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJlbWFpbCI6ImpvZWxAZ21haWwuY29tIiwicm9sZSI6ImFnZW50IiwiaWF0IjoxNzY0MjcyMzg3LCJleHAiOjE3NjQzNTg3ODd9.oVPxLp0BcrTEKycAzJnhojEP5FGZgsxd7al3hCtOWFk";

		console.log("[createProperty] Creating property. Token present:", !!token);
		console.log(
			"[createProperty] NEXT_PUBLIC_API_URL:",
			process.env.NEXT_PUBLIC_API_URL,
		);

		const res = await ApiConnector.getInstance().post<Property>(
			`${root_path}`,
			_formData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return res.data;
	} catch (err: unknown) {
		const error = err as ApiError;
		console.error("[createProperty] Error creating property:", error);
		if (error.response) {
			const serverError = error.response.data;
			if (serverError?.error) {
				return { error: serverError.error };
			}
			if (serverError?.message) {
				return { error: serverError.message };
			}
			return { error: `Error del servidor: ${error.response.status}` };
		}
		if (error.request) {
			return { error: "Error de conexión. Verifica tu conexión a internet." };
		}
		return { error: error.message || "Error al procesar la solicitud" };
	}
}
