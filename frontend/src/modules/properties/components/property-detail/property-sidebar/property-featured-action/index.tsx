import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@src/components/ui/form";
import { Spinner } from "@src/components/ui/spinner";
import { Switch } from "@src/components/ui/switch";
import { cn } from "@src/lib/utils";
import { toggleFeaturedProperty } from "@src/modules/properties/services/property-service";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { type ArchiveProperty, ArchivePropertySchema } from "./schema";

type Props = {
	propertyId: number;
	isFeatured: boolean;
};

export default function PropertyFeaturedAction({
	propertyId,
	isFeatured: initialIsFeatured,
}: Props) {
	const form = useForm<ArchiveProperty>({
		resolver: zodResolver(ArchivePropertySchema),
		defaultValues: {
			isFeatured: initialIsFeatured,
		},
	});

	const onSubmit = async (data: ArchiveProperty) => {
		try {
			const result = await toggleFeaturedProperty(propertyId, data.isFeatured);

			if (result.success) {
				toast.success(
					data.isFeatured
						? "Propiedad destacada en web"
						: "Propiedad quitada de destacados en web",
				);
			} else {
				form.setValue("isFeatured", !data.isFeatured);
				toast.error("Error al actualizar el estado destacado");
			}
		} catch (error) {
			console.error(error);
			form.setValue("isFeatured", !data.isFeatured);
			toast.error("Error al actualizar el estado destacado");
		}
	};

	return (
		<Form {...form}>
			<FormField
				control={form.control}
				name="isFeatured"
				render={({ field }) => (
					<FormItem
						className={cn(
							"border-tertiary text-tertiary relative flex w-full items-center rounded-md border shadow-xs h-12 space-y-0",
						)}
					>
						<FormLabel className="flex items-center text-base h-12 justify-between w-full gap-2 px-3 py-3 cursor-pointer font-normal m-0">
							<span>
								{field.value ? "Destacada en web" : "Destacar en web"}
							</span>
							<div className="ml-auto flex items-center gap-2">
								<FormControl>
									{form.formState.isSubmitting ? (
										<Spinner />
									) : (
										<Switch
											size="sm"
											checked={field.value}
											onCheckedChange={async (checked) => {
												field.onChange(checked);
												await form.handleSubmit(onSubmit)();
											}}
											disabled={form.formState.isSubmitting}
										/>
									)}
								</FormControl>
							</div>
						</FormLabel>
					</FormItem>
				)}
			/>
		</Form>
	);
}
