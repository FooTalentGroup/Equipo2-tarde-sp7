import { paths } from "@src/lib/paths";
import {
	Building2Icon,
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
				title: "Agregar cliente",
				icon: Plus,
				href: paths.agent.clients.leads.new(),
			},
			{
				title: "Leads",
				icon: UserCheck,
				href: paths.agent.clients.leads.index(),
			},
			{
				title: "Inquilinos",
				icon: Users,
				href: paths.agent.clients.inquilinos.index(),
			},
			{
				title: "Propietarios",
				icon: HouseIcon,
				href: paths.agent.clients.owners.index(),
			},
		],
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
		href: paths.admin.dashboard(),
	},
] as NavigationItem[];
