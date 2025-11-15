import { NextResponse } from "next/server";

import {
	createPropertySchema,
	type Property,
} from "@src/modules/properties/schemas/property.schema";

import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "src/data/properties.json");

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const fileData = fs.readFileSync(filePath, "utf-8");
		const properties = JSON.parse(fileData) as Property[];
		const property = properties.find((p) => p.id === id);
		if (!property) {
			return NextResponse.json(
				{ message: "Propiedad no encontrada" },
				{ status: 404 },
			);
		}

		return NextResponse.json(property);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Error al obtener la propiedad" },
			{ status: 500 },
		);
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const body = await req.json();

	try {
		const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as Property[];
		const index = data.findIndex((p) => p.id === id);

		if (index === -1) {
			return NextResponse.json(
				{ error: "Propiedad no encontrada" },
				{ status: 404 },
			);
		}

		// Validate incoming fields (partial update allowed)
		const updateSchema = createPropertySchema.partial();
		const parsed = updateSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Datos inválidos", details: parsed.error.format() },
				{ status: 400 },
			);
		}

		// Apply only the validated data
		data[index] = { ...data[index], ...parsed.data };

		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

		return NextResponse.json(data[index], { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Error al actualizar la propiedad" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const fileData = fs.readFileSync(filePath, "utf-8");
		const properties = JSON.parse(fileData) as Property[];
		const updated = properties.filter((p) => p.id !== id);
		fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
		return NextResponse.json({ message: "Property deleted" });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Error deleting property" },
			{ status: 500 },
		);
	}
}
