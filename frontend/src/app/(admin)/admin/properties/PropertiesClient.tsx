"use client";

import {
  useGetProperties,
  useCreateProperty,
  useUpdateProperty,
  usePropertySearch,
} from "@src/modules/properties/hook";
import {
  CreatePropertyDialog,
  EditPropertyDialog,
  DeletePropertyButton,
  PropertySearchInput,
} from "@src/modules/properties/components";
import Link from "next/link";

export function PropertiesClient() {
  const { properties, loading, refetch } = useGetProperties();
  const { form, onSubmit, loading: creating } = useCreateProperty(refetch);
  const { onSubmit: onUpdate, loading: updating } = useUpdateProperty(refetch);

  const { query, setQuery, filtered } = usePropertySearch(properties);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Propiedades</h1>
        <CreatePropertyDialog
          form={form}
          onSubmit={onSubmit}
          loading={creating}
        />
      </div>

      <div className="mb-4">
        <PropertySearchInput query={query} setQuery={setQuery} />
      </div>

      {loading ? (
        <p>Cargando propiedades...</p>
      ) : filtered.length === 0 ? (
        <p>No se encontraron propiedades.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((prop) => (
            <li
              key={prop.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <Link
                  href={`/admin/properties/${prop.id}`}
                  className="hover:underline font-semibold"
                >
                  {prop.title}
                </Link>{" "}
                - ${prop.price}
              </div>
              <div className="flex flex-col md:flex-row px-1 gap-2">
                <DeletePropertyButton id={prop.id} onDeleted={refetch} />
                <EditPropertyDialog
                  property={prop}
                  onSubmit={onUpdate}
                  loading={updating}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
