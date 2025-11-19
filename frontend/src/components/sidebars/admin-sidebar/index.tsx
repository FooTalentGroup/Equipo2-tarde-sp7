"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { Button } from "@src/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@src/components/ui/sidebar";

import { navigation } from "./data";

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar className="border-0!">
			<SidebarHeader className="pt-5 pb-0 gap-[30px]">
				<Avatar className="rounded-md aspect-video w-full max-w-[180px] mx-auto h-[130px]">
					<AvatarImage
						src="https://github.com/shadcn.png"
						alt="@shadcn"
						className="object-cover aspect-video w-full h-full"
					/>
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<Button
					variant="secondary"
					className="rounded-xl mx-auto w-full max-w-[167px] h-12 items-center"
				>
					<PlusIcon
						className="w-4 h-4 text-secondary-foreground font-bold mb-0.5"
						strokeWidth={3}
					/>
					Crear
				</Button>
			</SidebarHeader>

			<SidebarContent>
				{navigation.map((section, key: number) => (
					<SidebarGroup key={`${key}`}>
						<SidebarGroupContent>
							<SidebarMenu>
								{section.items.map((item) => {
									const isActive =
										pathname === item.href ||
										pathname.startsWith(`${item.href}/`);
									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild
												isActive={isActive}
												tooltip={item.title}
											>
												<Link href={item.href}>
													<item.icon className="size-5!" />
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			{/* <SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/">
								<Home />
								<span>Ir al sitio público</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter> */}

			{/* <SidebarRail /> */}
		</Sidebar>
	);
}
