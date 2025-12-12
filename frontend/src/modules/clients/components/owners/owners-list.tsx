"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { paths } from "@src/lib/paths";
import { deleteClientById } from "@src/modules/clients/services/clients-service";
import { ClientsPagination } from "@src/modules/clients/ui/clients-pagination";
import { DeleteClientDialog } from "@src/modules/clients/ui/delete-client-dialog";
import { OwnersCard } from "@src/modules/clients/ui/owners-card";
import type { Owner, OwnerWithProperties } from "@src/types/clients/owner";
import { toast } from "sonner";

interface OwnersListProps {
	owners: (Owner | OwnerWithProperties)[];
	itemsPerPage?: number;
}

export function OwnersList({ owners, itemsPerPage = 10 }: OwnersListProps) {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);
	const [ownersList, setOwnersList] = useState(owners);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [ownerToDelete, setOwnerToDelete] = useState<
		Owner | OwnerWithProperties | null
	>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const totalPages = Math.ceil(ownersList.length / itemsPerPage);

	// Calcular items de la página actual
	const paginatedOwners = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return ownersList.slice(startIndex, endIndex);
	}, [ownersList, currentPage, itemsPerPage]);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleEdit = (id: number) => {
		router.push(paths.agent.clients.owners.edit(id));
	};

	const handleDelete = (id: number) => {
		const owner = ownersList.find((item) => item.id === id);
		if (!owner) return;
		setOwnerToDelete(owner);
		setOpenDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		if (!ownerToDelete) return;
		setIsDeleting(true);
		try {
			const result = await deleteClientById(ownerToDelete.id.toString());
			if (result) {
				setOwnersList((prev) => prev.filter((o) => o.id !== ownerToDelete.id));
				toast.success("Propietario eliminado correctamente");
				router.refresh();
				setOpenDeleteDialog(false);
				setOwnerToDelete(null);
			} else {
				toast.error("No se pudo eliminar el propietario");
			}
		} catch (error) {
			console.error("Error al eliminar propietario:", error);
			toast.error("Error al eliminar el propietario");
		} finally {
			setIsDeleting(false);
		}
	};

	if (ownersList.length === 0) {
		return (
			<div className="text-center py-8 text-slate-500">
				No hay propietarios disponibles
			</div>
		);
	}

	return (
		<>
			<div className="space-y-6">
				<div className="space-y-0">
					{paginatedOwners.map((owner) => (
						<OwnersCard
							key={owner.id}
							owner={owner}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>
					))}
				</div>

				{totalPages > 1 && (
					<ClientsPagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				)}
			</div>

			<DeleteClientDialog
				open={openDeleteDialog}
				onOpenChange={(open) => {
					setOpenDeleteDialog(open);
					if (!open) setOwnerToDelete(null);
				}}
				onConfirm={handleConfirmDelete}
				clientName={
					ownerToDelete
						? `${ownerToDelete.first_name} ${ownerToDelete.last_name}`
						: ""
				}
				isDeleting={isDeleting}
				type="propietario"
			/>
		</>
	);
}
