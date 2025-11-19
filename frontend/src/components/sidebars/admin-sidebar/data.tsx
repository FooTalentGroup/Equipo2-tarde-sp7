import { paths } from "@src/lib/paths";
import {
	Building2Icon,
	ChartColumnIncreasing,
	type LucideIcon,
	MessageSquare,
	Users,
} from "lucide-react";

export type NavigationItem = {
	title?: string;
	href: string;
	icon: LucideIcon;
};

export const navigation = [
	{
		items: [
			{
				title: "Propiedades",
				href: paths.admin.properties.index(),
				icon: Building2Icon,
			},
			{
				title: "Clientes",
				href: paths.admin.clients.index(),
				icon: Users,
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
		] as NavigationItem[],
	},
];
