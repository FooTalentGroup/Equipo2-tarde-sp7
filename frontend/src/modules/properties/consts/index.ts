import { PropertyStatus, type PropertyType } from "@src/types/property";

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

export const PROPERTY_STATUS_CONFIG = {
	[PropertyStatus.AVAILABLE]: {
		label: "Disponible",
		variant: "success" as const,
		badgeLabel: "Venta",
	},
	[PropertyStatus.UNAVAILABLE]: {
		label: "No Disponible",
		variant: "destructive" as const,
		badgeLabel: "Vendido",
	},
} as const;
