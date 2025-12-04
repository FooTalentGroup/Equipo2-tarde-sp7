"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@src/components/ui/collapsible";
import {
	Sidebar,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@src/components/ui/sidebar";
import { ROLES, type Role } from "@src/types/user";
import { ChevronRight } from "lucide-react";

import { adminnavigation, agentNavigation } from "./data";

type Props = {
	role: Role;
};

export default function ProtectedSidebar({ role }: Props) {
	const pathname = usePathname();

	function handleGetCurrentNavigation() {
		if (role === ROLES.ADMIN) {
			return adminnavigation;
		}

		if (role === ROLES.AGENT) {
			return agentNavigation;
		}

		return [];
	}
	return (
		<Sidebar className="border-r-0!">
			<SidebarHeader className="pt-8 pb-0 gap-[30px]">
				<Avatar className="rounded-md aspect-video w-full max-w-[180px] mx-auto h-[130px] border-primary border p-3">
					<AvatarImage
						src="data:image/png;base64,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"
						alt="@shadcn"
						className="object-cover aspect-video w-full h-full"
					/>
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</SidebarHeader>

			<SidebarGroup className="py-8">
				<SidebarMenu className="">
					{handleGetCurrentNavigation().map((item) => {
						if (item.items && item.items.length > 0) {
							const isItemActive = pathname.startsWith(item.href);

							return (
								<Collapsible
									key={item.title}
									asChild
									defaultOpen={isItemActive || item.isActive}
									className="group/collapsible"
								>
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton
												tooltip={item.title}
												isActive={isItemActive}
											>
												{item.icon && <item.icon className="" />}
												<span>{item.title}</span>
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub className="pr-0 mr-0">
												{item.items.map((subItem) => {
													const isSubItemActive = pathname === subItem.href;

													return (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton
																asChild
																isActive={isSubItemActive}
															>
																<Link href={subItem.href}>
																	{subItem.icon && <subItem.icon />}
																	<span>{subItem.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													);
												})}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							);
						}

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={pathname === item.href}>
									<Link href={item.href}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroup>

			{/* <SidebarRail /> */}
		</Sidebar>
	);
}
