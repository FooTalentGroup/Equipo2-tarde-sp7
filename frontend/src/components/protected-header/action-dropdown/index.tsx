"use client";

import Link from "next/link";

import { Button } from "@src/components/ui/button";
import { ButtonGroup } from "@src/components/ui/button-group";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { paths } from "@src/lib/paths";
import { Building2, ChevronDown, Plus, User } from "lucide-react";

export default function ActionDropdown() {
	return (
		<ButtonGroup>
			<Button asChild variant="tertiary" size="default" className="mr-0.5 w-27">
				<Link href={paths.agent.properties.new()} className="flex items-center">
					<Plus />
					Crear
				</Link>
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="tertiary" size="icon" aria-label="More Options">
						<ChevronDown />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="">
					<DropdownMenuGroup>
						<Link href={paths.agent.properties.new()}>
							<DropdownMenuItem className="hover:text-tertiary">
								<Building2 className="hover:text-inherit" />
								Crear propiedad
							</DropdownMenuItem>
						</Link>
						<Link href={paths.agent.clients.newLeads()}>
							<DropdownMenuItem className="hover:text-tertiary">
								<User className="hover:text-inherit" />
								Crear cliente
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</ButtonGroup>
	);
}
