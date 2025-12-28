import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const requiredFields = ["first_name", "last_name", "email", "password"];
		const missingFields = requiredFields.filter((field) => !body[field]);

		if (missingFields.length > 0) {
			return NextResponse.json(
				{ error: `Faltan campos requeridos: ${missingFields.join(", ")}` },
				{ status: 400 },
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(body.email)) {
			return NextResponse.json({ error: "Email inválido" }, { status: 400 });
		}

		const authToken = request.cookies.get("auth_token")?.value;

		if (!authToken) {
			return NextResponse.json(
				{ error: "No autorizado. Token no encontrado." },
				{ status: 401 },
			);
		}

		const payload = {
			first_name: body.first_name,
			last_name: body.last_name,
			email: body.email,
			phone: body.phone || "",
			password: body.password,
			role_id: body.role_id ? Number(body.role_id) : 2, // Default a agent
		};

		const backendResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
				body: JSON.stringify(payload),
			},
		);

		if (!backendResponse.ok) {
			let errorMessage = "Error al registrar usuario";

			try {
				const errorData = await backendResponse.json();
				errorMessage = errorData.message || errorData.error || errorMessage;
			} catch {
				errorMessage = await backendResponse.text();
			}

			return NextResponse.json(
				{ error: errorMessage },
				{ status: backendResponse.status },
			);
		}

		const data = await backendResponse.json();
		return NextResponse.json(data, { status: 201 });
	} catch (error) {
		console.error("Error en POST /api/auth/register:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
