"use client";

import { useState } from "react";

import { ConsultationDetailSheet } from "@src/modules/consultations/components/consultation-detail/ConsultationDetailSheet";
import { ConsultationCard } from "@src/modules/consultations/ui/ConsultationCard";
import type { Consultation } from "@src/types/consultations";
import { toast } from "sonner";

import {
	convertConsultationToLead,
	deleteConsultation,
	markConsultationAsRead,
	markConsultationAsUnread,
} from "../service/consultation-service";

type Props = {
	consultationsData: Consultation[];
};

export default function ListConsultations({ consultationsData }: Props) {
	const [consultations, setConsultations] = useState<Consultation[]>(
		consultationsData || [],
	);
	const [selectedConsultation, setSelectedConsultation] =
		useState<Consultation | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [consultationContactMap, setConsultationContactMap] = useState<
		Map<number, number>
	>(new Map());

	const handleCardClick = (consultation: Consultation) => {
		setSelectedConsultation(consultation);
		setDialogOpen(true);

		// Marcar como leído al abrir
		if (!consultation.is_read) {
			handleMarkAsRead(consultation.id);
		}
	};

	const handleMarkAsRead = async (id: number) => {
		setConsultations((prev) =>
			prev.map((c) => (c.id === id ? { ...c, is_read: true } : c)),
		);
		await markConsultationAsRead(id).catch((error) => {
			console.error("Error marking consultation as read:", error);
		});
	};

	const handleMarkAsUnread = async (id: number) => {
		setConsultations((prev) =>
			prev.map((c) => (c.id === id ? { ...c, is_read: false } : c)),
		);

		await markConsultationAsUnread(id).catch((error) => {
			console.error("Error marking consultation as unread:", error);
		});
	};

	const handleAddContact = async (consultation: Consultation) => {
		try {
			const result = await convertConsultationToLead(consultation.id);

			// Si la conversión fue exitosa, guardar el contactId en el mapa
			if (result?.client?.id) {
				setConsultationContactMap((prev) =>
					new Map(prev).set(consultation.id, result.client.id),
				);
				// Mantener el sheet abierto para que el usuario pueda agregar propiedades
				toast.success("Contacto agregado exitosamente");
			} else {
				// Si no devolvió cliente, eliminar la consulta como antes
				setConsultations((prev) =>
					prev.filter((c) => c.id !== consultation.id),
				);
				setSelectedConsultation((prev) =>
					prev?.id === consultation.id ? null : prev,
				);
				setDialogOpen((open) =>
					open && selectedConsultation?.id === consultation.id ? false : open,
				);
				await deleteConsultation(consultation.id);
				toast.success("Contacto agregado exitosamente");
			}
		} catch (error) {
			console.error("Error converting consultation to lead:", error);
			toast.error("No se pudo convertir la consulta a lead");
		}
	};

	const handleDelete = (id: number) => {
		const idToRemove = Number(id);
		setConsultations((prev) => prev.filter((c) => Number(c.id) !== idToRemove));
		setSelectedConsultation((prev) => (prev?.id === idToRemove ? null : prev));
		setDialogOpen((open) =>
			selectedConsultation?.id === idToRemove ? false : open,
		);
	};

	return (
		<div className="w-full">
			<div className="space-y-4">
				{consultations.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-500">No hay consultas para mostrar</p>
					</div>
				) : (
					consultations.map((consultation) => (
						<ConsultationCard
							key={consultation.id}
							consultation={consultation}
							onMarkAsRead={handleMarkAsRead}
							onMarkAsUnread={handleMarkAsUnread}
							onDelete={handleDelete}
							onClick={() => handleCardClick(consultation)}
						/>
					))
				)}
			</div>

			<ConsultationDetailSheet
				consultation={selectedConsultation}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onAddContact={handleAddContact}
				contactId={
					selectedConsultation?.client?.id ??
					(selectedConsultation
						? consultationContactMap.get(selectedConsultation.id)
						: undefined)
				}
			/>
		</div>
	);
}
