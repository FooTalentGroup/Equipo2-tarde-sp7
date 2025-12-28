import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@src/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";
import type { PropertyForm } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

type Props = {
	form: UseFormReturn<PropertyForm>;
};

export default function PropertyValuesForm({ form }: Props) {
	return (
		<div className="grid lg:grid-cols-2 gap-4 lg:gap-10 items-start">
			<FormField
				control={form.control}
				name="values.prices.0.price"
				render={({ field }) => (
					<FormItem>
						<FormLabel required>Precio</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupAddon align="inline-start" className="">
									<FormField
										control={form.control}
										name="values.prices.0.currency_symbol"
										render={({ field: currencyField }) => (
											<Select
												onValueChange={currencyField.onChange}
												value={currencyField.value}
											>
												<SelectTrigger
													size="default"
													className=" border-t-0 border-b-0 border-l-0 rounded-t-none rounded-b-none bg-transparent! rounded-r-none shadow-none"
												>
													<InputGroupButton
														asChild
														variant="ghost"
														className=""
													>
														<SelectValue placeholder="Moneda" />
													</InputGroupButton>
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectItem value="USD">USD</SelectItem>
														<SelectItem value="ARS">ARS</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
										)}
									/>
								</InputGroupAddon>
								<InputGroupInput
									type="number"
									placeholder="150.000"
									{...field}
								/>
							</InputGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="values.expenses.0.amount"
				render={({ field }) => (
					<FormItem>
						<FormLabel required>Expensas</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupAddon align="inline-start" className="">
									<FormField
										control={form.control}
										name="values.expenses.0.currency_symbol"
										render={({ field: currencyField }) => (
											<Select
												onValueChange={currencyField.onChange}
												value={currencyField.value}
											>
												<SelectTrigger
													size="default"
													className=" border-t-0 border-b-0 border-l-0 rounded-t-none rounded-b-none bg-transparent! rounded-r-none shadow-none"
												>
													<InputGroupButton
														variant="ghost"
														className=""
														asChild
													>
														<SelectValue placeholder="Moneda" />
													</InputGroupButton>
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectItem value="USD">USD</SelectItem>
														<SelectItem value="ARS">ARS</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
										)}
									/>
								</InputGroupAddon>
								<InputGroupInput
									type="number"
									placeholder="150.000"
									{...field}
								/>
							</InputGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
