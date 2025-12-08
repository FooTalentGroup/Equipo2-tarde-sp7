import type { PropertyStatusType } from "@src/types/property";

export const PROPERTY_STATUS: { label: string; value: PropertyStatusType }[] = [
	{
		label: "Disponible",
		value: "Disponible",
	},
	{
		label: "En Venta",
		value: "En Venta",
	},
	{
		label: "Alquilada",
		value: "Alquilada",
	},
	{
		label: "Vendida",
		value: "Vendida",
	},
	{
		label: "Reservada",
		value: "Reservada",
	},
];

export const PROPERTY_STATUS_CONFIG: Record<
	PropertyStatusType,
	{
		label: string;
		variant: "success" | "destructive" | "default" | "secondary" | "outline";
		badgeLabel: string;
	}
> = {
	Disponible: {
		label: "Disponible",
		variant: "success",
		badgeLabel: "Disponible",
	},
	"En Venta": {
		label: "En Venta",
		variant: "default",
		badgeLabel: "En Venta",
	},
	Alquilada: {
		label: "Alquilada",
		variant: "secondary",
		badgeLabel: "Alquilada",
	},
	Vendida: {
		label: "Vendida",
		variant: "destructive",
		badgeLabel: "Vendida",
	},
	Reservada: {
		label: "Reservada",
		variant: "outline",
		badgeLabel: "Reservada",
	},
} as const;
