import type { PropertyStatusType, PropertyType } from "@src/types/property";

export const PROPERTY_TYPE: { label: string; value: PropertyType }[] = [
	{
		label: "Casa",
		value: "Casa",
	},
	{
		label: "Departamento",
		value: "Departamento",
	},
	{
		label: "PH",
		value: "PH",
	},
	{
		label: "Local Comercial",
		value: "Local Comercial",
	},
	{
		label: "Oficina",
		value: "Oficina",
	},
	{
		label: "Terreno",
		value: "Terreno",
	},
	{
		label: "Cochera",
		value: "Cochera",
	},
	{
		label: "Depósito",
		value: "Depósito",
	},
];

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
