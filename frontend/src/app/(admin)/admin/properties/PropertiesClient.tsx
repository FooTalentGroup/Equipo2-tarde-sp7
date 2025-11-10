"use client";

import { useGetProperties } from "@src/modules/properties/hook/useGetProperties";
import { useCreateProperty } from "@src/modules/properties/hook/useCreateProperty";
import { useUpdateProperty } from "@src/modules/properties/hook/useUpdateProperty";
import { CreatePropertyDialog } from "@src/modules/properties/components/CreatePropertyDialog";
import { EditPropertyDialog } from "@src/modules/properties/components/EditPropertyDialog";

export function PropertiesClient() {
  const { properties, loading, refetch } = useGetProperties();
  const { form, onSubmit, loading: creating } = useCreateProperty(refetch);
  const { onSubmit: onUpdate, loading: updating } = useUpdateProperty(refetch);

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

      {loading ? (
        <p>Cargando propiedades...</p>
      ) : (
        <ul className="space-y-2">
          {properties.map((prop) => (
            <li
              key={prop.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <strong>{prop.title}</strong> - ${prop.price}
              </div>
              <EditPropertyDialog
                property={prop}
                onSubmit={onUpdate}
                loading={updating}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
