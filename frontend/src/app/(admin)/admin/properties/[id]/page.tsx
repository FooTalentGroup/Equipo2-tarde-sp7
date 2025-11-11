import { PropertyDetailClient } from "./PropertyDetailClient";
import { notFound } from "next/navigation";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const resolved = await params;
  const id = resolved?.id;
  if (!id) return notFound();

  return <PropertyDetailClient id={id} />;
}
