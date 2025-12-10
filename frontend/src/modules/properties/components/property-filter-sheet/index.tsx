"use client";

import { useEffect, useState } from "react";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
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
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@src/components/ui/sheet";
import { Switch } from "@src/components/ui/switch";
import { PROPERTY_TYPE } from "@src/modules/properties/consts";
import { OperationType, OperationTypeLabel } from "@src/types/property";
import type { PropertyFilterForm } from "@src/types/property-filter";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useForm } from "react-hook-form";

export default function PropertyFilterSheet() {
	const [sheetOpen, setSheetOpen] = useState<boolean>(false);

	const [propertyTypeId, setPropertyTypeId] = useQueryState(
		"property_type_id",
		parseAsString.withDefault("").withOptions({ shallow: false }),
	);
	const [minPrice, setMinPrice] = useQueryState(
		"min_price",
		parseAsString.withDefault("").withOptions({ shallow: false }),
	);
	const [maxPrice, setMaxPrice] = useQueryState(
		"max_price",
		parseAsString.withDefault("").withOptions({ shallow: false }),
	);
	const [search, setSearch] = useQueryState(
		"search",
		parseAsString.withDefault("").withOptions({ shallow: false }),
	);

	const [operationTypeId, setOperationTypeId] = useQueryState(
		"operation_type_id",
		parseAsString.withDefault("").withOptions({ shallow: false }),
	);
	// const [includeArchived, setIncludeArchived] = useQueryState(
	// 	"includeArchived",
	// 	parseAsBoolean.withDefault(false).withOptions({ shallow: false }),
	// );
	const [featuredWeb, setFeaturedWeb] = useQueryState(
		"featured_web",
		parseAsBoolean.withDefault(false).withOptions({ shallow: false }),
	);

	const form = useForm<PropertyFilterForm>({
		defaultValues: {
			property_type_id: propertyTypeId,
			min_price: minPrice,
			max_price: maxPrice,
			search: search,
			operation_type_id: operationTypeId,
			// includeArchived: includeArchived,
			featured_web: featuredWeb,
		},
	});

	useEffect(() => {
		form.reset({
			property_type_id: propertyTypeId,
			min_price: minPrice,
			max_price: maxPrice,
			search: search,
			operation_type_id: operationTypeId,
			// includeArchived: includeArchived,
			featured_web: featuredWeb,
		});
	}, [
		propertyTypeId,
		minPrice,
		maxPrice,
		search,
		operationTypeId,
		featuredWeb,
		form,
	]);

	async function onSubmit(data: PropertyFilterForm) {
		try {
			await Promise.all([
				setPropertyTypeId(data.property_type_id || null),
				setMinPrice(data.min_price || null),
				setMaxPrice(data.max_price || null),
				setSearch(data.search || null),
				setOperationTypeId(data.operation_type_id || null),
				// setIncludeArchived(data.includeArchived || null),
				setFeaturedWeb(data.featured_web || null),
			]);
			setSheetOpen(false);
		} catch (error) {
			console.error("Error applying filters:", error);
		}
	}

	async function handleOnClear() {
		setSheetOpen(false);
		await Promise.all([
			setPropertyTypeId(null),
			setMinPrice(null),
			setMaxPrice(null),
			setSearch(null),
			setOperationTypeId(null),
			// setIncludeArchived(null),
			setFeaturedWeb(null),
		]);
	}

	const activeFilters = [
		propertyTypeId,
		minPrice,
		maxPrice,
		operationTypeId,
		//includeArchived,
		featuredWeb,
	].filter(Boolean).length;

	return (
		<section className="">
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				<SheetTrigger asChild>
					<Button type="submit" variant="outline" className="w-[140px]">
						<AdjustmentsHorizontalIcon className="size-6" /> Filtrar
						{activeFilters > 0 && (
							<Badge className=" " variant="default">
								{activeFilters}
							</Badge>
						)}
					</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Filtros</SheetTitle>
						<SheetDescription className="sr-only">
							Filtros avanzados para propiedades
						</SheetDescription>
					</SheetHeader>
					<div className="grid flex-1 auto-rows-min gap-6 px-6">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="grid gap-4"
							>
								<div className="flex flex-col gap-4">
									<FormField
										control={form.control}
										name="property_type_id"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tipo de propiedad</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Seleccionar" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectGroup>
															{PROPERTY_TYPE.map((type) => (
																<SelectItem key={type.value} value={type.value}>
																	{type.label}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
											</FormItem>
										)}
									/>

									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="min_price"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Precio Mín.</FormLabel>
													<FormControl>
														<Input type="number" placeholder="Mín" {...field} />
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="max_price"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Precio Máx.</FormLabel>
													<FormControl>
														<Input type="number" placeholder="Máx" {...field} />
													</FormControl>
												</FormItem>
											)}
										/>
									</div>

									{/* <FormField
										control={form.control}
										name="includeArchived"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<FormLabel className="text-base">
														Incluir archivados
													</FormLabel>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/> */}
									<FormField
										control={form.control}
										name="operation_type_id"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tipo de operación</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Seleccionar" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectGroup>
															<SelectItem value={OperationType.SALE.toString()}>
																{OperationTypeLabel[OperationType.SALE]}
															</SelectItem>
															<SelectItem value={OperationType.RENT.toString()}>
																{OperationTypeLabel[OperationType.RENT]}
															</SelectItem>
														</SelectGroup>
													</SelectContent>
												</Select>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="featured_web"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<FormLabel className="text-base">
														Destacado en web
													</FormLabel>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							</form>
						</Form>
					</div>
					<SheetFooter className="grid grid-cols-2 gap-5">
						<Button variant="outline" size="lg" onClick={handleOnClear}>
							Limpiar filtros
						</Button>
						<Button
							type="button"
							size="lg"
							className="w-full"
							onClick={form.handleSubmit(onSubmit)}
						>
							<AdjustmentsHorizontalIcon className="size-6" />
							Filtrar
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</section>
	);
}
