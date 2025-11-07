import { CreatePropertyDialog } from "@src/modules/properties/components/CreatePropertyDialog";
import { useCreateProperty } from "@src/modules/properties/hook/useCreateProperty";

export const metadata = {
  title: "Propiedades",
  description: "Gestión de propiedades inmobiliarias",
};

export default function PropertiesPage() {
  const { form, onSubmit, loading: creating } = useCreateProperty();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Propiedades</h1>
      <CreatePropertyDialog
        form={form}
        onSubmit={onSubmit}
        loading={creating}
      />
    </div>
  );
}

