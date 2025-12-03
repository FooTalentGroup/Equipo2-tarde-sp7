"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@src/components/ui/form";
import { Switch } from "@src/components/ui/switch";
import { type PropertyForm, VisibilityStatus } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

type Props = {
	form: UseFormReturn<PropertyForm>;
};

export default function PropertyPublicationStatus({ form }: Props) {
	return (
		<div className="grid gap-4">
			<FormField
				control={form.control}
				name="basic.visibility_status"
				render={({ field }) => (
					<FormItem className="flex flex-row items-center justify-between">
						<div className="space-y-0.5">
							<FormLabel className="text-base font-semibold text-foreground">
								{field.value === VisibilityStatus.PUBLISHED
									? "La propiedad está habilitada"
									: "La propiedad está deshabilitada"}
							</FormLabel>
						</div>
						<FormControl>
							<Switch
								checked={field.value === VisibilityStatus.PUBLISHED}
								onCheckedChange={(checked) =>
									field.onChange(
										checked
											? VisibilityStatus.PUBLISHED
											: VisibilityStatus.NOT_PUBLISHED,
									)
								}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	);
}
