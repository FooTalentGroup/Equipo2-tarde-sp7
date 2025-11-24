import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";
import type { PropertyData } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

interface PropertyPricingProps {
	form: UseFormReturn<PropertyData>;
}

export default function PropertyPricing({ form }: PropertyPricingProps) {
	return (
		<div className="grid grid-cols-3 gap-10 items-start">
			<FormField
				control={form.control}
				name="price"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Precio</FormLabel>
						<FormControl>
							<Input type="number" placeholder="0" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="expenses"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Expensas</FormLabel>
						<FormControl>
							<Input type="number" placeholder="0" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="currency"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Moneda</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Seleccionar" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="usd">USD</SelectItem>
									<SelectItem value="ars">ARS</SelectItem>
									<SelectItem value="eur">EUR</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
