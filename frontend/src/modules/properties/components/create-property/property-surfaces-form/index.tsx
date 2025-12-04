import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import type { PropertyForm } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

interface PropertySurfacesProps {
	form: UseFormReturn<PropertyForm>;
}

export default function PropertySurfacesForm({ form }: PropertySurfacesProps) {
	return (
		<div className="grid grid-cols-2 gap-10 items-start">
			<div className="grid gap-4">
				<FormField
					control={form.control}
					name="surface.land_area"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Terreno</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="surface.covered_area"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cubierta (m²)</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="surface.uncovered_area"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descubierta</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="grid gap-4 items-start">
				<FormField
					control={form.control}
					name="surface.semi_covered_area"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Semicubierta</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="surface.total_built_area"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Total construido</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="surface.total_area"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Total</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
