"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { useSearch } from "@src/contexts/search-context";
import { paths } from "@src/lib/paths";
import { deleteClientById } from "@src/modules/clients/services/clients-service";
import { ClientsPagination } from "@src/modules/clients/ui/clients-pagination";
import { DeleteClientDialog } from "@src/modules/clients/ui/delete-client-dialog";
import { LeadsCard } from "@src/modules/clients/ui/leads-card";
import type { Lead, LeadWithProperties } from "@src/types/clients/lead";
import { toast } from "sonner";

interface LeadsListProps {
	leads: (Lead | LeadWithProperties)[];
	itemsPerPage?: number;
}

export function LeadsList({ leads, itemsPerPage = 10 }: LeadsListProps) {
	const router = useRouter();
	const { filterData } = useSearch();
	const [currentPage, setCurrentPage] = useState(1);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [leadToDelete, setLeadToDelete] = useState<
		Lead | LeadWithProperties | null
	>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Filtrar leads basado en el término de búsqueda
	const filteredLeads = useMemo(() => {
		return filterData(leads, [
			"first_name",
			"last_name",
			"dni",
			"address",
			"phone",
			"email",
		]);
	}, [leads, filterData]);

	const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

	// Calcular items de la página actual
	const paginatedLeads = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return filteredLeads.slice(startIndex, endIndex);
	}, [filteredLeads, currentPage, itemsPerPage]);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleEdit = (id: number) => {
		router.push(paths.agent.clients.leads.edit(id));
	};

	const handleDelete = (id: number) => {
		const lead = filteredLeads.find((item) => item.id === id);
		if (!lead) return;
		setLeadToDelete(lead);
		setOpenDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		if (!leadToDelete) return;
		setIsDeleting(true);
		try {
			const result = await deleteClientById(leadToDelete.id.toString());
			if (result) {
				toast.success("Lead eliminado correctamente");
				router.refresh();
				setOpenDeleteDialog(false);
				setLeadToDelete(null);
			} else {
				toast.error("No se pudo eliminar el lead");
			}
		} catch (error) {
			console.error("Error al eliminar lead:", error);
			toast.error("Error al eliminar el lead");
		} finally {
			setIsDeleting(false);
		}
	};

	if (filteredLeads.length === 0) {
		return (
			<div className="text-center py-8 text-slate-500">
				No hay leads disponibles
			</div>
		);
	}

	return (
		<>
			<div className="space-y-6">
				<div className="space-y-0">
					{paginatedLeads.map((lead) => (
						<LeadsCard
							key={lead.id}
							lead={lead}
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
					if (!open) setLeadToDelete(null);
				}}
				onConfirm={handleConfirmDelete}
				clientName={
					leadToDelete
						? `${leadToDelete.first_name} ${leadToDelete.last_name}`
						: ""
				}
				isDeleting={isDeleting}
				type="lead"
			/>
		</>
	);
}
