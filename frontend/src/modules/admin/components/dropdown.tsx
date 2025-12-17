"use client";

import { useState } from "react";

import { Button } from "@src/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

import type { DropdownProps } from "../types";
import { DeleteUserAlert, EditUserModal } from "./";

export const Dropdown = ({ id, user, onUserUpdated }: DropdownProps) => {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost">
						<Ellipsis className="text-input-border stroke-1.5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="mx-3">
					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={() => setEditOpen(true)}>
							Editar
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-destructive-foreground"
							onSelect={() => setDeleteOpen(true)}
						>
							Eliminar
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<EditUserModal
				user={user}
				onUserUpdated={onUserUpdated}
				open={editOpen}
				onOpenChange={setEditOpen}
			/>
			<DeleteUserAlert id={id} open={deleteOpen} onOpenChange={setDeleteOpen} />
		</>
	);
};
