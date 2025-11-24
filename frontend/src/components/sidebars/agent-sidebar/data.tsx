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
		href: paths.admin.dashboard(),
		icon: House,
	},
	{
		title: "Propiedades",
		icon: Building2Icon,
		isActive: false,
		items: [
			{
				title: "Lista de propiedades",
				icon: List,
				href: paths.admin.properties.index(),
			},
			{
				title: "Agregar propiedad",
				icon: Plus,
				href: paths.admin.properties.new(),
			},
		],
	},
	{
		title: "Clientes",
		icon: Users,
		isActive: false,
		items: [
			{
				title: "Agregar cliente",
				icon: Plus,
				href: paths.admin.clients.new(),
			},
			{
				title: "Leads",
				icon: UserCheck,
				href: paths.admin.clients.leads(),
			},
			{
				title: "Buscar propiedades",
				icon: House,
				href: paths.admin.clients.searchProperties(),
			},
		],
	},
	{
		title: "Reportes",
		href: paths.admin.reports.index(),
		icon: ChartColumnIncreasing,
	},
	{
		title: "Consultas",
		href: paths.admin.inquiries.index(),
		icon: MessageSquare,
	},
] as NavigationItem[];
