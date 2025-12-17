// ConsultationContactInfo.tsx
"use client";

import type { Consultation } from "@src/types/consultations";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MailIcon, PhoneIcon } from "lucide-react";

interface ConsultationContactInfoProps {
	consultation: Consultation;
}

export function ConsultationContactInfo({
	consultation,
}: ConsultationContactInfoProps) {
	// Obtener el contacto: puede ser client o consultant
	const contact = consultation.client || consultation.consultant;

	const name = contact
		? `${contact.first_name} ${contact.last_name}`
		: "Contacto desconocido";

	const email = contact?.email || "No disponible";
	const phone = contact?.phone || "No disponible";

	const formattedDate = format(
		new Date(consultation.consultation_date),
		"d 'de' MMM · h:mm a",
		{ locale: es },
	);

	return (
		<div className="space-y-3">
			{/* Nombre */}
			<h3 className="font-semibold text-base">{name}</h3>

			{/* Propiedad (opcional) */}
			{consultation.property && (
				<p className="text-sm text-slate-600">{consultation.property.title}</p>
			)}

			<div className="space-y-2 text-sm text-slate-700">
				{/* Email */}
				{email !== "No disponible" && (
					<div className="flex items-center gap-2">
						<MailIcon className="h-4 w-4 text-slate-400" />
						<span>{email}</span>
					</div>
				)}

				{/* Teléfono */}
				{phone !== "No disponible" && (
					<div className="flex items-center gap-2">
						<PhoneIcon className="h-4 w-4 text-slate-400" />
						<span>{phone}</span>
					</div>
				)}
			</div>

			{/* Fecha */}
			<p className="text-xs text-slate-500">{formattedDate}</p>
		</div>
	);
}
