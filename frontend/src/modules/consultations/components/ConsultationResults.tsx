"use client";

import { startTransition, useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@src/components/ui/button";
import type { Consultation } from "@src/types/consultations";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { deleteConsultation } from "../service/consultation-service";
import type { ConsultationFilterForm } from "../types/consultation-filter";
import ListConsultations from "./ListConsultations";

interface Props {
	filters: ConsultationFilterForm;
	initialData: { data: Consultation[]; total: number };
	isSelectionMode?: boolean;
	onCancelSelection?: () => void;
}

export default function ConsultationResults({
	initialData,
	isSelectionMode: externalIsSelectionMode = false,
	onCancelSelection: externalOnCancelSelection,
}: Props) {
	const [internalIsSelectionMode, setInternalIsSelectionMode] = useState(false);
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
	const router = useRouter();

	const isSelectionMode = externalIsSelectionMode || internalIsSelectionMode;
	const onCancelSelection =
		externalOnCancelSelection || (() => setInternalIsSelectionMode(false));

	const handleStartSelection = () => {
		if (externalOnCancelSelection) {
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
			for (const id of selectedIds) {
				await deleteConsultation(id);
			}

			toast.success(
				`${selectedIds.size} consulta(s) eliminada(s) correctamente`,
			);
			handleCancelSelection();

			startTransition(() => router.refresh());
		} catch {
			toast.error("Error al eliminar las consultas");
		}
	};

	return (
		<div className="w-full">
			{isSelectionMode && (
				<div className="flex items-center lg:justify-between gap-4 lg:gap-0 mb-4">
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
						<TrashIcon className="size-4 lg:hidden" />
						<span className="hidden lg:inline">Eliminar seleccionadas</span>
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
