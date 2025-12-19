"use client";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@src/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { Button } from "@src/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@src/components/ui/sidebar";
import { useIsMobile } from "@src/hooks/use-mobile";
import { logoutAction } from "@src/modules/auth/actions/auth.actions";
import type { User } from "@src/types";
import { LogOut } from "lucide-react";

type Props = {
	user: User | null;
};

export default function UserMenuTrigger({ user }: Props) {
	const isMobile = useIsMobile();

	if (!user) return null;

	async function handleLogout() {
		await logoutAction();
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent gap-2 data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-8 w-8 rounded-full">
						<AvatarImage
							className="aspect-square"
							src="/images/admin-picture.png"
							alt={`${user.first_name} ${user.last_name}`}
						/>
						<AvatarFallback className="rounded-lg">CN</AvatarFallback>
					</Avatar>
					<div className="hidden md:grid flex-1 text-left text-sm leading-tight">
						<p className="truncate font-medium text-lg">{`${user.first_name} ${user.last_name}`}</p>
					</div>
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				side={isMobile ? "bottom" : "bottom"}
				align="end"
				sideOffset={4}
			>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<DropdownMenuItem
							onSelect={(e) => e.preventDefault()}
							className="hover:text-tertiary"
						>
							<LogOut className="hover:text-inherit" />
							Cerrar sesión
						</DropdownMenuItem>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
							<AlertDialogDescription>
								Tu sesión actual se cerrará y tendrás que volver a iniciar
								sesión para acceder a la plataforma.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancelar</AlertDialogCancel>
							<Button variant="destructive" onClick={handleLogout}>
								Cerrar sesión
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
