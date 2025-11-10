import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/properties.json");

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const index = data.findIndex((p: any) => p.id === params.id);

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
