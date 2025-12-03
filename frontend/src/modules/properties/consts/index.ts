import { PropertyStatus } from "@src/types/property";

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
