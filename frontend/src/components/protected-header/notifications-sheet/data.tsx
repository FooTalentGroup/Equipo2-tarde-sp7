import type { Notification } from "@src/types/notification";

export const notificationsToday: Notification[] = [
	{
		status: "keys",
		title: "Entrega de llaves - Av. Libertador 1234",
		description: "Coordinar entrega de llaves con el nuevo inquilino",
		schedule: "14:00 hs",
	},
	{
		status: "call",
		title: "Llamada con cliente - Sr. Martínez",
		description: "Consulta sobre propiedad en Palermo",
		schedule: "16:30 hs",
	},
];

export const alertsAndReminders: Notification[] = [
	{
		status: "appraisal",
		title: "Tasación pendiente - Casa Belgrano",
		description: "Realizar tasación para nueva propiedad en cartera",
		schedule: "Mañana 10:00 hs",
	},
	{
		status: "call",
		title: "Seguimiento cliente - Familia Rodríguez",
		description: "Contactar para feedback de visita anterior",
		schedule: "En 2 días",
	},
	{
		status: "meeting",
		title: "Reunión con propietario - Sr. González",
		description: "Discutir ajuste de precio de alquiler",
		schedule: "Viernes 11:00 hs",
	},
];

export const contractsAndRentals: Notification[] = [
	{
		status: "expiration",
		title: "Vencimiento de contrato - Av. Corrientes 890",
		description: "El contrato vence en 30 días",
		schedule: "19/12/2025",
	},
	{
		status: "expiration",
		title: "Renovación pendiente - San Telmo",
		description: "Inquilino solicitó renovación de contrato",
		schedule: "22/12/2025",
	},
	// {
	// 	status: "increase",
	// 	title: "Aumento de alquiler - Villa Crespo",
	// 	description: "Aplicar ajuste anual del contrato",
	// 	schedule: "15/12/2025",
	// },
	// {
	// 	status: "expiration",
	// 	title: "Vencimiento próximo - Caballito",
	// 	description: "Contactar inquilino para renovación",
	// 	schedule: "20/12/2025",
	// },
];
