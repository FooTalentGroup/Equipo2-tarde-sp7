import { type NextRequest, NextResponse } from "next/server";

import { env } from "@src/config/env";

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await request.json();

		// Obtener el token de autenticación
		const authToken = request.cookies.get("auth_token")?.value;

		// Hacer la petición al backend real
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...(authToken && { Authorization: `Bearer ${authToken}` }),
				},
				body: JSON.stringify(body),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			return NextResponse.json(
				{ error: error.message || "Error al actualizar usuario" },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error en PUT /api/users/[id]:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		// Get auth token from cookies
		const authToken = request.cookies.get("auth_token")?.value;
		console.log("DELETE request for user:", id, "Has token:", !!authToken);

		if (!authToken) {
			return NextResponse.json({ error: "No autorizado" }, { status: 401 });
		}

		// Make request to backend API
		const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${authToken}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error("Backend error:", response.status, errorData);
			return NextResponse.json(
				{ error: errorData.message || "Error al eliminar usuario" },
				{ status: response.status },
			);
		}

		// Return success response
		return NextResponse.json(
			{ message: "Usuario eliminado exitosamente" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error in delete user API route:", error);
		return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
	}
}
