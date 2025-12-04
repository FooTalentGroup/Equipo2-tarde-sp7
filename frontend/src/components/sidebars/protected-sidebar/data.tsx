import { paths } from "@src/lib/paths";
import {
	Building2Icon,
	ChartColumnIncreasing,
	House,
	HouseIcon,
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

export const agentNavigation = [
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
				title: "Leads",
				icon: UserCheck,
				href: paths.agent.clients.leads(),
			},
			{
				title: "Inquilinos",
				icon: Users,
				href: paths.agent.clients.inquilinos(),
			},
			{
				title: "Propiedades",
				icon: HouseIcon,
				href: paths.agent.clients.propietarios(),
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

export const adminnavigation = [
	{
		title: "Usuarios",
		icon: Users,
		isActive: true,
		items: [
			{
				title: "Lista de usuarios",
				icon: List,
				href: paths.admin.dashboard(),
			},
		],
	},
] as NavigationItem[];
