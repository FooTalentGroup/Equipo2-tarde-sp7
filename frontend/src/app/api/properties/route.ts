import { NextResponse } from "next/server";

import fs from "fs";
import path from "path";

// Ruta absoluta al archivo JSON
const filePath = path.join(process.cwd(), "src", "data", "properties.json");

// GET: opcional, por si después querés leerlo
export async function GET() {
	const fileData = fs.readFileSync(filePath, "utf8");
	const properties = JSON.parse(fileData);
	return NextResponse.json(properties);
}

// POST: crear nueva propiedad
export async function POST(req: Request) {
	try {
		const newProperty = await req.json();

		// Leer el archivo actual
		const fileData = fs.readFileSync(filePath, "utf8");
		const properties = JSON.parse(fileData);

		// Agregar nueva propiedad con ID
		const propertyWithId = {
			id: crypto.randomUUID(),
			...newProperty,
		};

		properties.push(propertyWithId);

		// Guardar nuevamente el archivo
		fs.writeFileSync(filePath, JSON.stringify(properties, null, 2));

		return NextResponse.json(propertyWithId, { status: 201 });
	} catch (error) {
		console.error("Error writing JSON:", error);
		return NextResponse.json(
			{ message: "Error al guardar la propiedad" },
			{ status: 500 },
		);
	}
}
