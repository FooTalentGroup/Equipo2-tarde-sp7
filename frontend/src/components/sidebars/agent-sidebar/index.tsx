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
import { ChevronRight } from "lucide-react";

import { navigation } from "./data";

export default function AgentSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar className="">
			<SidebarHeader className="pt-8 pb-0 gap-[30px]">
				<Avatar className="rounded-md aspect-video w-full max-w-[180px] mx-auto h-[130px]">
					<AvatarImage
						src="https://github.com/shadcn.png"
						alt="@shadcn"
						className="object-cover aspect-video w-full h-full"
					/>
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</SidebarHeader>

			<SidebarGroup className="py-8">
				<SidebarMenu className="">
					{navigation.map((item) => {
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
