"use client";

import { useState } from "react";

import { ConsultationDetailSheet } from "@src/modules/consultations/components/consultation-detail/ConsultationDetailSheet";
import { ConsultationCard } from "@src/modules/consultations/ui/ConsultationCard";
import type { Consultation } from "@src/types/consultations";
import { toast } from "sonner";

import {
	convertConsultationToLead,
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

	// Polling ligero para detectar nuevas consultas sin recargar la página
	/* 	useEffect(() => {
		let isActive = true;

		const fetchConsultations = async () => {
			try {
				const newConsultations = await getConsultationsForPolling();

				if (!isActive) return;

				setConsultations((prev) => {
					// Si la cantidad o IDs cambiaron, reemplazamos; si no, mantenemos para evitar renders innecesarios
					const prevIds = new Set(prev.map((c) => c.id));
					const changed =
						newConsultations.length !== prev.length ||
						newConsultations.some((c) => !prevIds.has(c.id));
					return changed ? newConsultations : prev;
				});

				// Si la consulta seleccionada está abierta, sincronizamos sus datos
				setSelectedConsultation((prev) => {
					if (!prev) return prev;
					const updated = newConsultations.find((c) => c.id === prev.id);
					return updated ? updated : prev;
				});
			} catch (error) {
				console.error("Error fetching consultations:", error);
			}
		};

		fetchConsultations();
		const intervalId = setInterval(fetchConsultations, 30000); // 30s

		return () => {
			isActive = false;
			clearInterval(intervalId);
		};
	}, []); */

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

			setConsultations((prev) =>
				prev.map((c) =>
					c.id === consultation.id
						? {
								...c,
								client: result.client,
								consultant: null,
							}
						: c,
				),
			);

			setSelectedConsultation((prev) =>
				prev && prev.id === consultation.id
					? { ...prev, client: result.client, consultant: null }
					: prev,
			);

			toast.success(result.message || "Consulta convertida a lead");
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
			/>
		</div>
	);
}
