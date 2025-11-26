import { paths } from "@src/lib/paths";
import { House, List, type LucideIcon, Plus, Users } from "lucide-react";

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
		title: "Usuarios",
		icon: Users,
		isActive: false,
		items: [
			{
				title: "Lista de usuarios",
				icon: List,
				href: paths.admin.users.index(),
			},
			{
				title: "Agregar usuario",
				icon: Plus,
				href: paths.admin.users.new(),
			},
		],
	},
] as NavigationItem[];
