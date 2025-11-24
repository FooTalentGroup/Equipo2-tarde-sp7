"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@src/components/ui/form";
import { Switch } from "@src/components/ui/switch";
import type { PropertyData } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

interface PropertyPublicationStatusProps {
	form: UseFormReturn<PropertyData>;
}

export default function PropertyPublicationStatus({
	form,
}: PropertyPublicationStatusProps) {
	return (
		<div className="grid gap-4">
			<FormField
				control={form.control}
				name="isPublished"
				render={({ field }) => (
					<FormItem className="flex flex-row items-center justify-between">
						<div className="space-y-0.5">
							<FormLabel className="text-base font-semibold text-foreground">
								{field.value
									? "La propiedad está habilitada"
									: "La propiedad está deshabilitada"}
							</FormLabel>
							{/* <FormDescription>
								{field.value
									? "La propiedad está habilitada"
									: "La propiedad está deshabilitada"}
							</FormDescription> */}
						</div>
						<FormControl>
							<Switch checked={field.value} onCheckedChange={field.onChange} />
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	);
}
