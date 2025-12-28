import { PROPERTY_STATUS_CONFIG } from "../consts";

export const statusConfig = (statusName: string) =>
	PROPERTY_STATUS_CONFIG[
		(statusName as keyof typeof PROPERTY_STATUS_CONFIG) || "Disponible"
	];
