import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@src/components/ui/form";
import { Switch } from "@src/components/ui/switch";
import { cn } from "@src/lib/utils";
import {
	archiveProperty,
	unarchiveProperty,
} from "@src/modules/properties/services/property-service";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { type ArchiveProperty, ArchivePropertySchema } from "./schema";

type Props = {
	propertyId: number;
	isEnabled: boolean;
};
export default function PropertyArchiveAction({
	propertyId,
	isEnabled: initialIsEnabled,
}: Props) {
	const form = useForm<ArchiveProperty>({
		resolver: zodResolver(ArchivePropertySchema),
		defaultValues: {
			isEnabled: initialIsEnabled,
		},
	});

	const onSubmit = async (data: ArchiveProperty) => {
		try {
			const result = data.isEnabled
				? await unarchiveProperty(propertyId)
				: await archiveProperty(propertyId);

			if (result.success) {
				toast.success(
					data.isEnabled ? "Propiedad habilitada" : "Propiedad deshabilitada",
				);
			} else {
				form.setValue("isEnabled", !data.isEnabled);
				toast.error("Error al actualizar el estado de la propiedad");
			}
		} catch (error) {
			console.error(error);
			form.setValue("isEnabled", !data.isEnabled);
			toast.error("Error al actualizar el estado de la propiedad");
		}
	};

	return (
		<Form {...form}>
			<FormField
				control={form.control}
				name="isEnabled"
				render={({ field }) => (
					<FormItem
						className={cn(
							"border-tertiary text-tertiary relative flex w-full items-center rounded-md border shadow-xs h-12 space-y-0",
							form.formState.isSubmitting && "opacity-50",
						)}
					>
						<FormLabel className="flex items-center text-base h-12 justify-between w-full gap-2 px-3 py-3 cursor-pointer font-normal m-0">
							<span>
								{field.value ? "Deshabilitar propiedad" : "Habilitar propiedad"}
							</span>
							<FormControl>
								<Switch
									className="ml-auto"
									checked={field.value}
									onCheckedChange={async (checked) => {
										field.onChange(checked);
										await form.handleSubmit(onSubmit)();
									}}
									disabled={form.formState.isSubmitting}
								/>
							</FormControl>
						</FormLabel>
					</FormItem>
				)}
			/>
		</Form>
	);
}
