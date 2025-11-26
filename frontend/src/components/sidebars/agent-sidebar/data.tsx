import { paths } from "@src/lib/paths";
import {
	Building2Icon,
	ChartColumnIncreasing,
	House,
	List,
	type LucideIcon,
	MessageSquare,
	Plus,
	UserCheck,
	Users,
} from "lucide-react";

export type NavigationItem = {
	title?: string;
	href: string;
	icon: LucideIcon;
	isActive?: boolean;
	items?: NavigationItem[];
};

export const navigation = [
	{
		title: "Panel principal",
		href: paths.agent.dashboard(),
		icon: House,
	},
	{
		title: "Mis Propiedades",
		icon: Building2Icon,
		isActive: false,
		items: [
			{
				title: "Lista de propiedades",
				icon: List,
				href: paths.agent.properties.index(),
			},
			{
				title: "Agregar propiedad",
				icon: Plus,
				href: paths.agent.properties.new(),
			},
		],
	},
	{
		title: "Mis Clientes",
		icon: Users,
		isActive: false,
		items: [
			{
				title: "Agregar cliente",
				icon: Plus,
				href: paths.agent.clients.new(),
			},
			{
				title: "Leads",
				icon: UserCheck,
				href: paths.agent.clients.leads(),
			},
			{
				title: "Buscar propiedades",
				icon: House,
				href: paths.agent.clients.searchProperties(),
			},
		],
	},
	{
		title: "Reportes",
		href: paths.agent.reports.index(),
		icon: ChartColumnIncreasing,
	},
	{
		title: "Consultas",
		href: paths.agent.inquiries.index(),
		icon: MessageSquare,
	},
] as NavigationItem[];
