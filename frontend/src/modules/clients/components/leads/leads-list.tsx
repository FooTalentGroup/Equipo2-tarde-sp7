"use client";

import { useMemo, useState } from "react";

import { ClientsPagination } from "@src/modules/clients/ui/clients-pagination";
import { LeadsCard } from "@src/modules/clients/ui/leads-card";
import type { Lead, LeadWithProperties } from "@src/types/clients/lead";

interface LeadsListProps {
	leads: (Lead | LeadWithProperties)[];
	itemsPerPage?: number;
}

export function LeadsList({ leads, itemsPerPage = 10 }: LeadsListProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [leadsList, setLeadsList] = useState(leads);

	const totalPages = Math.ceil(leadsList.length / itemsPerPage);

	// Calcular items de la página actual
	const paginatedLeads = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return leadsList.slice(startIndex, endIndex);
	}, [leadsList, currentPage, itemsPerPage]);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleEdit = (id: number) => {
		// TODO: Implementar edición de lead
		console.log("Editar lead:", id);
	};

	const handleDelete = (id: number) => {
		// TODO: Implementar eliminación de lead
		setLeadsList(leadsList.filter((lead) => lead.id !== id));
		console.log("Eliminar lead:", id);
	};

	if (leadsList.length === 0) {
		return (
			<div className="text-center py-8 text-slate-500">
				No hay leads disponibles
			</div>
		);
	}

	return (
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
	);
}
