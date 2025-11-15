"use client";

import { useState } from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@src/components/ui/table";
import {
	AlertDialogDeleteClient,
	ColumnFilterDropdown,
	CreateClient,
	EditClientModal,
	type FilterOption,
} from "@src/modules/clients/components";
import type { Client, ClientData } from "@src/types/client";

export default function DataTableClient() {
	let nextId = 0;
	const [clients, setClients] = useState<Client[]>([]);
	const [visibleColumns, setVisibleColumns] = useState({
		name: true,
		email: true,
	});

	const handleCreateClient = (clientData: ClientData) => {
		const newClient: Client = {
			id: ++nextId,
			name: clientData.name,
			email: clientData.email,
			number: clientData.number,
		};
		setClients([...clients, newClient]);
	};

	const handleDeleteClient = (currentClient: Client) => {
		setClients(clients.filter((c) => c.id !== currentClient.id));
	};

	const handleSaveEdit = (updatedClient: Client) => {
		setClients(
			clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)),
		);
	};

	const toggleColumn = (column: FilterOption) => {
		setVisibleColumns((prev) => ({
			...prev,
			[column]: !prev[column],
		}));
	};

	return (
		<>
			<div className="flex justify-between items-center mt-2">
				<CreateClient onSubmit={handleCreateClient} />

				<ColumnFilterDropdown
					visibleColumns={visibleColumns}
					onToggleColumn={toggleColumn}
				/>
			</div>

			{/* Tabla */}
			<div className="overflow-hidden rounded-md border mt-2">
				<Table>
					<TableHeader>
						<TableRow>
							{visibleColumns.name && <TableHead>Nombre</TableHead>}
							{visibleColumns.email && <TableHead>Email</TableHead>}
							<TableHead>Número</TableHead>
							<TableHead>Editar</TableHead>
							<TableHead>Eliminar</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{clients.map((c) => {
							return (
								<TableRow key={++nextId}>
									{visibleColumns.name && <TableCell>{c.name}</TableCell>}
									{visibleColumns.email && <TableCell>{c.email}</TableCell>}
									<TableCell>{c.number}</TableCell>
									<TableCell>
										<EditClientModal client={c} onSave={handleSaveEdit} />
									</TableCell>
									<TableCell>
										<AlertDialogDeleteClient
											handleClick={() => handleDeleteClient(c)}
										/>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
