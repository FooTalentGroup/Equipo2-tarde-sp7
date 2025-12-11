"use client";

import { useMemo, useState } from "react";

import { ClientsPagination } from "@src/modules/clients/ui/clients-pagination";
import { OwnersCard } from "@src/modules/clients/ui/owners-card";
import type { Owner } from "@src/types/clients/owner";

interface OwnersListProps {
	owners: Owner[];
	itemsPerPage?: number;
}

export function OwnersList({ owners, itemsPerPage = 10 }: OwnersListProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [ownersList, setOwnersList] = useState(owners);

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
		// TODO: Implementar edición de owner
		console.log("Editar owner:", id);
	};

	const handleDelete = (id: number) => {
		// TODO: Implementar eliminación de owner
		setOwnersList(ownersList.filter((owner) => owner.id !== id));
		console.log("Eliminar owner:", id);
	};

	if (ownersList.length === 0) {
		return (
			<div className="text-center py-8 text-slate-500">
				No hay propietarios disponibles
			</div>
		);
	}

	return (
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
	);
}
