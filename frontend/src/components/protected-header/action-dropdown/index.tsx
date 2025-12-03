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
			<Button asChild variant="tertiary" size="default" className="mr-0.5">
				<Link href={paths.agent.properties.new()}>
					<Plus />
					Crear propiedad
				</Link>
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="tertiary" size="icon" aria-label="More Options">
						<ChevronDown />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-52">
					<DropdownMenuGroup>
						<Link href={paths.agent.properties.new()}>
							<DropdownMenuItem>
								<Building2 />
								Crear propiedad
							</DropdownMenuItem>
						</Link>
						<Link href={paths.agent.clients.new()}>
							<DropdownMenuItem>
								<User />
								Crear cliente
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</ButtonGroup>
	);
}
