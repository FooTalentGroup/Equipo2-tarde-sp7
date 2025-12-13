"use client";

import { useCallback, useMemo } from "react";

import { Button } from "@src/components/ui/button";
import { useContactManager } from "@src/hooks/useContactManager";
import type { Consultation } from "@src/types/consultations";
import { UserPlusIcon } from "lucide-react";

interface ConsultationActionsProps {
	consultation: Consultation;
	onAddContact?: (consultation: Consultation) => void;
	onOpenChange: (open: boolean) => void;
}

export function ConsultationActions({
	consultation,
	onAddContact,
	onOpenChange,
}: ConsultationActionsProps) {
	const contact = consultation.client || consultation.consultant;

	const whatsappUrl = useMemo(() => {
		const phone = contact?.phone || "";
		const normalized = phone.replace(/[^0-9+]/g, "");
		if (!normalized) return "";
		return `https://wa.me/${normalized.replace(/^\+/, "")}`;
	}, [contact?.phone]);

	const { existingContact, isProcessing, handleAddOrView } = useContactManager({
		contact,
		onAddContact: onAddContact ? () => onAddContact(consultation) : undefined,
	});

	const handleLogAndOpenContact = useCallback(async () => {
		const success = await handleAddOrView();
		if (success) {
			onOpenChange(false);
		}
	}, [handleAddOrView, onOpenChange]);

	return (
		<div className="space-y-3 border-t bg-slate-50 px-6 py-4">
			<Button asChild disabled={!whatsappUrl} className="w-full" size="lg">
				<a
					href={whatsappUrl || undefined}
					target="_blank"
					rel="noopener noreferrer"
				>
					Ir a WhatsApp
				</a>
			</Button>

			{/* Botón Agregar / Ver Contacto */}
			<Button
				variant="outline"
				onClick={handleLogAndOpenContact}
				disabled={isProcessing}
				className="w-full"
				size="lg"
			>
				<UserPlusIcon className="h-4 w-4 mr-2" />
				{isProcessing
					? "Procesando..."
					: existingContact
						? "Ver Contacto"
						: "Agregar Contacto"}
			</Button>
		</div>
	);
}
