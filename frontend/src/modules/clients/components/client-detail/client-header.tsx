"use client";

import { useState } from "react";

import Link from "next/link";
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
import { deleteClientById } from "@src/modules/clients/services/clients-service";
import { DeleteClientDialog } from "@src/modules/clients/ui/delete-client-dialog";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface ClientHeaderProps {
	id: string;
	firstName: string;
	lastName: string;
	dni?: string;
	status: "lead" | "inquilino" | "propietario";
	editPath: string;
	consultationTypeName?: string;
}

export function ClientHeader({
	id,
	firstName,
	lastName,
	dni,
	status,
	editPath,
	consultationTypeName,
}: ClientHeaderProps) {
	const router = useRouter();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const initial = (firstName ?? lastName ?? "?").charAt(0);
	const statusLabel = status
		? status.charAt(0).toUpperCase() + status.slice(1)
		: "Cliente";

	const handleConfirmDelete = async () => {
		setIsDeleting(true);
		try {
			const result = await deleteClientById(id);
			if (result) {
				toast.success("Usuario eliminado correctamente");
				const listPath =
					status === "propietario"
						? paths.agent.clients.owners.index()
						: status === "lead"
							? paths.agent.clients.leads.index()
							: paths.agent.clients.inquilinos.index();
				router.push(listPath);
			} else {
				toast.error("No se pudo eliminar el usuario");
			}
		} catch (error) {
			console.error("Error al eliminar usuario:", error);
			toast.error("Error al eliminar el usuario");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<div className="mb-6">
				<Card>
					<CardContent className="px-6 py-2 lg:py-4">
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700 text-2xl uppercase">
									{initial}
								</div>
								<div>
									<div className="flex items-center gap-2 mb-1">
										<h1 className="text-xl lg:text-2xl font-semibold lg:font-bold text-slate-900">
											{firstName} {lastName}
										</h1>
										<StatusBadge
											status={status}
											className="hidden lg:inline-flex"
										>
											{statusLabel}
										</StatusBadge>
									</div>
									{status === "lead" && (
										<div className="text-xs text-balance lg:text-sm text-slate-600">
											Tipo de consulta:{" "}
											{consultationTypeName || "Consulta general"}
										</div>
									)}
									{dni && (
										<div className="text-sm text-slate-500">DNI: {dni}</div>
									)}
								</div>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<MoreHorizontal className="h-4 w-4 text-slate-500" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="center">
									<DropdownMenuItem asChild>
										<Link href={editPath}>Editar contacto</Link>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setOpenDeleteDialog(true)}
										className="text-red-600"
									>
										Eliminar usuario
									</DropdownMenuItem>

									{status === "lead" && (
										<>
											<DropdownMenuItem
												onClick={() => {
													router.push(paths.agent.clients.inquilinos.new(id));
												}}
											>
												Convertir en inquilino
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => {
													router.push(paths.agent.clients.owners.new(id));
												}}
											>
												Convertir en propietario
											</DropdownMenuItem>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</CardContent>
				</Card>
			</div>

			<DeleteClientDialog
				open={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={handleConfirmDelete}
				clientName={`${firstName} ${lastName}`}
				isDeleting={isDeleting}
				type={status}
			/>
		</>
	);
}
