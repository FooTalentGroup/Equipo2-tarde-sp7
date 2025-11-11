"use client";

import { useGetPropertyById } from "@src/modules/properties/hook/useGetPropertyById";
import Image from "next/image.js";

export function PropertyDetailClient({ id }: { id: string }) {
  const { property, loading } = useGetPropertyById(id);

  console.log("Property detail loaded:", id);
  if (loading) return <p>Cargando propiedad...</p>;
  if (!property) return <p>No se encontró la propiedad.</p>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-full md:w-1/2">
          <Image
            src={property.imageUrl || "/images/american-house.webp"}
            alt={property.title || "Property image"}
            width={800}
            height={500}
            className="w-full h-auto rounded"
          />
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
          <p className="text-gray-600 mb-4">{property.city}</p>
          <p className="mb-2">
            <strong>Precio:</strong> ${property.price}
          </p>
          <p className="mb-2">
            <strong>Dirección:</strong> {property.address}
          </p>
          <p className="mb-4">
            <strong>Descripción:</strong> {property.description}
          </p>
          <p>
            <strong>Dormitorios:</strong> {property.beds}
          </p>
          <p>
            <strong>Baños:</strong> {property.baths}
          </p>
        </div>
      </div>
    </div>
  );
}
