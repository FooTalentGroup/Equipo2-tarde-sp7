"use client";

import { useState } from "react";

import { ConsultationDetailSheet } from "@src/modules/consultations/components/consultation-detail/ConsultationDetailSheet";
import { ConsultationCard } from "@src/modules/consultations/ui/ConsultationCard";
import type { Consultation } from "@src/types/consultations";

import { markConsultationAsRead } from "../service/consultation-service";

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
		// TODO: Llamar al backend para marcar como no leído
		// await markConsultationAsUnread(id).catch((error) => {
		// 	console.error("Error marking consultation as unread:", error);
		// });
	};

	const handleSendResponse = async (
		consultationId: number,
		response: string,
	) => {
		// TODO: Llamar al backend para enviar respuesta
		console.log("Send response to:", consultationId, response);

		setConsultations((prev) =>
			prev.map((c) =>
				c.id === consultationId
					? {
							...c,
							response,
							response_date: new Date().toISOString(),
						}
					: c,
			),
		);
	};

	const handleAddContact = (consultation: Consultation) => {
		// TODO: Implementar lógica para agregar contacto
		console.log("Add contact:", consultation.client);
	};

	const handleDelete = (id: number) => {
		setConsultations((prev) => prev.filter((c) => c.id !== id));
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
				onSendResponse={handleSendResponse}
				onAddContact={handleAddContact}
			/>
		</div>
	);
}
