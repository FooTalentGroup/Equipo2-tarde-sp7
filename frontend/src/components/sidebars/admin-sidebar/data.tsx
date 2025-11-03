import {
	Building2,
	LayoutDashboard,
	type LucideIcon,
	Settings,
	Users,
} from "lucide-react";

export type NavigationItem = {
	title: string;
	href: string;
	icon: LucideIcon;
};

export const navigation = [
	{
		title: "General",
		items: [
			{
				title: "Dashboard",
				href: "/admin/dashboard",
				icon: LayoutDashboard,
			},
			{
				title: "Propiedades",
				href: "/admin/properties",
				icon: Building2,
			},
		],
	},
	{
		title: "Gestión",
		items: [
			{
				title: "Usuarios",
				href: "/users",
				icon: Users,
			},
			{
				title: "Configuración",
				href: "/settings",
				icon: Settings,
			},
		],
	},
];
