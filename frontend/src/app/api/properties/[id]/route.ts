import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/properties.json");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const properties = JSON.parse(fileData);
    const property = properties.find((p: any) => p.id === id);
    if (!property) {
      return NextResponse.json(
        { message: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al obtener la propiedad" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const index = data.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    data[index] = { ...data[index], ...body };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json(data[index], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar la propiedad" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const properties = JSON.parse(fileData);
    const updated = properties.filter((p: any) => p.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    return NextResponse.json({ message: "Property deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting property" },
      { status: 500 }
    );
  }
}
