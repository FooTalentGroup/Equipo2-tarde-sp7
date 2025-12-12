"use client";

import { useRouter } from "next/navigation";

import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { StatusBadge } from "@src/components/ui/status-badge";
import { paths } from "@src/lib/paths";
import type { Owner, OwnerWithProperties } from "@src/types/clients/owner";
import { MoreHorizontal } from "lucide-react";

interface OwnersCardProps {
	owner: Owner | OwnerWithProperties;
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
}

export function OwnersCard({ owner, onEdit, onDelete }: OwnersCardProps) {
	const router = useRouter();

	const ownerName = `${owner.first_name} ${owner.last_name}`;
	const propertiesCount =
		(owner as OwnerWithProperties).owned_properties?.length || 0;

	const handleCardClick = () => {
		router.push(paths.agent.clients.owners.detail(owner.id.toString()));
	};

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onEdit) {
			onEdit(owner.id);
		}
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(owner.id);
		}
	};

	return (
		<Card
			className="mb-3 cursor-pointer hover:bg-slate-50 transition-colors"
			onClick={handleCardClick}
		>
			<CardContent className="p-0 w-full">
				<div className="flex items-start justify-between px-4 py-4">
					<div className="flex items-center gap-4">
						<div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700">
							{owner.first_name.charAt(0)}
						</div>
						<div className="text-left">
							<div className="flex items-center gap-2">
								<span className="font-semibold text-slate-900">
									{ownerName}
								</span>
								<StatusBadge status="propietario" className="text-xs">
									Propietario
								</StatusBadge>
							</div>
							<div className="text-sm text-slate-500 mt-1">
								Tel: {owner.phone} · {owner.address || "Sin dirección"}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="text-right mr-2">
							<div className="text-xs text-slate-500">Propiedades</div>
							<div className="text-2xl font-bold text-slate-900">
								{propertiesCount}
							</div>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
								<Button variant="ghost" size="icon" className="h-8 w-8 -mt-7">
									<MoreHorizontal className="h-4 w-4 text-slate-500" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								onClick={(e) => e.stopPropagation()}
							>
								{onEdit && (
									<DropdownMenuItem onClick={handleEdit}>
										Editar cliente
									</DropdownMenuItem>
								)}
								{onDelete && (
									<DropdownMenuItem
										onClick={handleDelete}
										className="text-red-600"
									>
										Eliminar cliente
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
