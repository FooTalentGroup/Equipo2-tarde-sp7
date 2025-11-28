import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import type { Property } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

interface PropertySurfacesProps {
	form: UseFormReturn<Property>;
}

export default function PropertySurfacesForm({ form }: PropertySurfacesProps) {
	return (
		<div className="grid grid-cols-2 gap-10 items-start">
			<div className="grid gap-4">
				<FormField
					control={form.control}
					name="landArea"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Superficie del terreno (m²)</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="coveredArea"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Superficie cubierta (m²)</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="semiCoveredArea"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Superficie semicubierta (m²)</FormLabel>
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
					name="totalBuiltArea"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Superficie total construida (m²)</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="uncoveredArea"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Superficie descubierta (m²)</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="totalArea"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Superficie total (m²)</FormLabel>
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
