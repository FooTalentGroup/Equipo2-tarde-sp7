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
import { parseAmount } from "@src/lib/parsing";
import { paths } from "@src/lib/paths";
import type {
	Tenant,
	TenantWithRentedProperty,
} from "@src/types/clients/tenant";
import { MoreHorizontal } from "lucide-react";

interface TenantsCardProps {
	tenant: Tenant | TenantWithRentedProperty;
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
}

export function TenantsCard({ tenant, onEdit, onDelete }: TenantsCardProps) {
	const router = useRouter();

	const tenantName = `${tenant.first_name} ${tenant.last_name}`;
	const propertyTitle =
		(tenant as TenantWithRentedProperty).rented_property?.address
			?.full_address || "Sin propiedad asignada";
	const monthlyAmountRaw = (tenant as TenantWithRentedProperty).rented_property
		?.rental?.monthly_amount;
	const monthlyAmount = parseAmount(monthlyAmountRaw);

	const handleCardClick = () => {
		router.push(paths.agent.clients.inquilinos.detail(tenant.id));
	};

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onEdit) {
			onEdit(tenant.id);
		}
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(tenant.id);
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
							{tenant.first_name.charAt(0)}
						</div>
						<div className="text-left">
							<div className="flex items-center gap-2">
								<span className="font-semibold text-slate-900">
									{tenantName}
								</span>
								<StatusBadge status="inquilino" className="text-xs">
									Inquilino
								</StatusBadge>
							</div>
							<div className="text-sm text-slate-500 mt-1">
								Tel: {tenant.phone} · {propertyTitle}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="text-right mr-2">
							<div className="text-xs text-slate-500">Alquiler</div>
							<div className="text-2xl font-semibold text-slate-900">
								{monthlyAmount
									? `$${monthlyAmount.toLocaleString("es-AR")}`
									: "N/A"}
							</div>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
								<Button variant="ghost" size="icon" className="h-8 w-8 -mt-5">
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
