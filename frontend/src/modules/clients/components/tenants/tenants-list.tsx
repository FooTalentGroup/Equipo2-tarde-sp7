"use client";

import { useMemo, useState } from "react";

import { ClientsPagination } from "@src/modules/clients/ui/clients-pagination";
import { TenantsCard } from "@src/modules/clients/ui/tenants-card";
import type { Tenant } from "@src/types/clients/tenant";

interface TenantsListProps {
	tenants: Tenant[];
	itemsPerPage?: number;
}

export function TenantsList({ tenants, itemsPerPage = 10 }: TenantsListProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [tenantsList, setTenantsList] = useState(tenants);

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
		// TODO: Implementar edición de tenant
		console.log("Editar tenant:", id);
	};

	const handleDelete = (id: number) => {
		// TODO: Implementar eliminación de tenant
		setTenantsList(tenantsList.filter((tenant) => tenant.id !== id));
		console.log("Eliminar tenant:", id);
	};

	if (tenantsList.length === 0) {
		return (
			<div className="text-center py-8 text-slate-500">
				No hay inquilinos disponibles
			</div>
		);
	}

	return (
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
	);
}
