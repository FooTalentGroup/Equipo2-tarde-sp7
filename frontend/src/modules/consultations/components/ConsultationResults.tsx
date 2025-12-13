"use client";

import { useState } from "react";

import { Button } from "@src/components/ui/button";
import { toast } from "sonner";

import { deleteConsultation } from "../service/consultation-service";
import type { ConsultationFilterForm } from "../types/consultation-filter";
import ListConsultations from "./ListConsultations";

interface Props {
	filters: ConsultationFilterForm;
	initialData: { data: any[]; total: number };
	isSelectionMode?: boolean;
	onCancelSelection?: () => void;
}

export default function ConsultationResults({
	filters,
	initialData,
	isSelectionMode: externalIsSelectionMode = false,
	onCancelSelection: externalOnCancelSelection,
}: Props) {
	const [internalIsSelectionMode, setInternalIsSelectionMode] = useState(false);
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

	// Usar el estado externo si se proporciona, de lo contrario usar el interno
	const isSelectionMode = externalIsSelectionMode || internalIsSelectionMode;
	const onCancelSelection =
		externalOnCancelSelection || (() => setInternalIsSelectionMode(false));

	const handleStartSelection = () => {
		if (externalOnCancelSelection) {
			// Si hay un manejador externo, no cambiar el estado interno
			return;
		}
		setInternalIsSelectionMode(true);
		setSelectedIds(new Set());
	};

	const handleCancelSelection = () => {
		onCancelSelection();
		setSelectedIds(new Set());
	};

	const handleDeleteSelected = async () => {
		if (selectedIds.size === 0) return;

		try {
			// Eliminar las consultas seleccionadas
			for (const id of selectedIds) {
				await deleteConsultation(id);
			}

			toast.success(
				`${selectedIds.size} consulta(s) eliminada(s) correctamente`,
			);
			handleCancelSelection();

			// Recargar los datos después de eliminar
			window.location.reload();
		} catch (error) {
			console.error("Error deleting consultations:", error);
			toast.error("Error al eliminar las consultas");
		}
	};

	return (
		<div className="w-full">
			{isSelectionMode && (
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" onClick={handleCancelSelection}>
							Cancelar
						</Button>
						<span className="text-sm text-muted-foreground">
							{selectedIds.size} consulta(s) seleccionada(s)
						</span>
					</div>
					<Button
						variant="destructive"
						size="sm"
						onClick={handleDeleteSelected}
						disabled={selectedIds.size === 0}
					>
						Eliminar seleccionadas
					</Button>
				</div>
			)}
			<ListConsultations
				consultationsData={initialData.data}
				isSelectionMode={isSelectionMode}
				selectedIds={selectedIds}
				onStartSelection={handleStartSelection}
				onCancelSelection={handleCancelSelection}
				onDeleteSelected={handleDeleteSelected}
				onSelectionChange={setSelectedIds}
			/>
		</div>
	);
}
