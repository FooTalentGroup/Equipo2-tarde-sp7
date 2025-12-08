"use client";

import { Button } from "@src/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import { Checkbox } from "@src/components/ui/checkbox";
import { cn } from "@src/lib/utils";
import type { Price } from "@src/types/property-detail";

type Props = {
	prices: Price[];
	className?: string;
};

export default function PropertyValueCard({ prices, className }: Props) {
	const salePrice = prices.find((p) => p.operation_type.name === "Venta");
	const rentPrice = prices.find((p) => p.operation_type.name === "Alquiler");

	return (
		<Card className={cn("", className)}>
			<CardHeader>
				<CardTitle className="text-lg font-medium text-blue-900">
					Valor de propiedad
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="font-medium text-gray-700">Venta</span>
						<Checkbox checked={!!salePrice} />
					</div>
					<div className="flex items-center justify-center rounded-md bg-gray-100 py-3 text-xl font-bold text-gray-800">
						{salePrice
							? `${salePrice.currency.symbol} ${salePrice.price}`
							: "$ -"}
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="font-medium text-gray-700">Alquiler</span>
						<Checkbox checked={!!rentPrice} />
					</div>
					<div className="flex items-center justify-center rounded-md bg-gray-100 py-3 text-xl font-bold text-gray-800">
						{rentPrice
							? `${rentPrice.currency.symbol} ${rentPrice.price}`
							: "$ -"}
					</div>
				</div>

				<Button className="w-full bg-blue-700 hover:bg-blue-800">
					Editar valores
				</Button>
			</CardContent>
		</Card>
	);
}
