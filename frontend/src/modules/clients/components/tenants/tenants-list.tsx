"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { paths } from "@src/lib/paths";
import { deleteClientById } from "@src/modules/clients/services/clients-service";
import { ClientsPagination } from "@src/modules/clients/ui/clients-pagination";
import { DeleteClientDialog } from "@src/modules/clients/ui/delete-client-dialog";
import { TenantsCard } from "@src/modules/clients/ui/tenants-card";
import type {
	Tenant,
	TenantWithRentedProperty,
} from "@src/types/clients/tenant";
import { toast } from "sonner";

interface TenantsListProps {
	tenants: (Tenant | TenantWithRentedProperty)[];
	itemsPerPage?: number;
}

export function TenantsList({ tenants, itemsPerPage = 10 }: TenantsListProps) {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);
	const [tenantsList, setTenantsList] = useState(tenants);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [tenantToDelete, setTenantToDelete] = useState<
		Tenant | TenantWithRentedProperty | null
	>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const totalPages = Math.ceil(tenantsList.length / itemsPerPage);

	// Calcular items de la página actual
	const paginatedTenants = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return tenantsList.slice(startIndex, endIndex);
	}, [tenantsList, currentPage, itemsPerPage]);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleEdit = (id: number) => {
		router.push(paths.agent.clients.inquilinos.edit(id));
	};

	const handleDelete = (id: number) => {
		const tenant = tenantsList.find((item) => item.id === id);
		if (!tenant) return;
		setTenantToDelete(tenant);
		setOpenDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		if (!tenantToDelete) return;
		setIsDeleting(true);
		try {
			const result = await deleteClientById(tenantToDelete.id.toString());
			if (result) {
				setTenantsList((prev) =>
					prev.filter((t) => t.id !== tenantToDelete.id),
				);
				toast.success("Inquilino eliminado correctamente");
				router.refresh();
				setOpenDeleteDialog(false);
				setTenantToDelete(null);
			} else {
				toast.error("No se pudo eliminar el inquilino");
			}
		} catch (error) {
			console.error("Error al eliminar inquilino:", error);
			toast.error("Error al eliminar el inquilino");
		} finally {
			setIsDeleting(false);
		}
	};

	if (tenantsList.length === 0) {
		return (
			<div className="text-center py-8 text-slate-500">
				No hay inquilinos disponibles
			</div>
		);
	}

	return (
		<>
			<div className="space-y-6">
				<div className="space-y-0">
					{paginatedTenants.map((tenant) => (
						<TenantsCard
							key={tenant.id}
							tenant={tenant}
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
					if (!open) setTenantToDelete(null);
				}}
				onConfirm={handleConfirmDelete}
				clientName={
					tenantToDelete
						? `${tenantToDelete.first_name} ${tenantToDelete.last_name}`
						: ""
				}
				isDeleting={isDeleting}
				type="inquilino"
			/>
		</>
	);
}
