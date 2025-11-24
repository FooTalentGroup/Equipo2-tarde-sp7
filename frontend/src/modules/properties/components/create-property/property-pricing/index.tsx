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
import type { PropertyData } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

interface PropertyPricingProps {
	form: UseFormReturn<PropertyData>;
}

export default function PropertyPricing({ form }: PropertyPricingProps) {
	return (
		<div className="grid grid-cols-2 gap-10 items-start">
			<div className="grid gap-4">
				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Precio</FormLabel>
							<FormControl>
								<InputGroup>
									<InputGroupAddon align="inline-start" className="">
										<FormField
											control={form.control}
											name="priceCurrency"
											render={({ field: currencyField }) => (
												<Select
													onValueChange={currencyField.onChange}
													value={currencyField.value}
												>
													<SelectTrigger className=" border-t-0 border-b-0 border-l-0 rounded-t-none rounded-b-none h-11! bg-transparent! rounded-r-none shadow-none">
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
				<FormField
					control={form.control}
					name="expenses"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Expensas</FormLabel>
							<FormControl>
								<InputGroup>
									<InputGroupAddon align="inline-start" className="">
										<FormField
											control={form.control}
											name="expensesCurrency"
											render={({ field: currencyField }) => (
												<Select
													onValueChange={currencyField.onChange}
													value={currencyField.value}
												>
													<SelectTrigger className=" border-t-0 border-b-0 border-l-0 rounded-t-none rounded-b-none h-11! bg-transparent! rounded-r-none shadow-none">
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
			<div></div>
		</div>
	);
}
