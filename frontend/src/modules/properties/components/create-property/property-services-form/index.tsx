import {
	FancyMultiSelect,
	type Option,
} from "@src/components/ui/fancy-multi-select";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@src/components/ui/form";
import type { PropertyForm } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

type Props = {
	form: UseFormReturn<PropertyForm>;
};

const SERVICES_OPTIONS: Option[] = [
	{ value: "agua_corriente", label: "Agua Corriente" },
	{ value: "luz", label: "Luz" },
	{ value: "gas_natural", label: "Gas Natural" },
	{ value: "desague_cloacal", label: "Desagüe Cloacal" },
	{ value: "pavimento", label: "Pavimento" },
	{ value: "internet", label: "Internet" },
	{ value: "cable", label: "Cable" },
	{ value: "telefono", label: "Teléfono" },
	{ value: "seguridad", label: "Seguridad" },
	{ value: "calefaccion", label: "Calefacción" },
	{ value: "aire_acondicionado", label: "Aire Acondicionado" },
];

export default function PropertyServicesForm({ form }: Props) {
	return (
		<div className="grid gap-4 max-w-xl mx-auto w-full">
			<FormField
				control={form.control}
				name="services.services"
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<FancyMultiSelect
								options={SERVICES_OPTIONS}
								value={field.value || []}
								onChange={field.onChange}
								placeholder="Seleccionar servicios..."
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
