import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export default async function PropertyDetailPage({ params }: Props) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${params.id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return notFound();
  const property = await res.json();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
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
  );
}
