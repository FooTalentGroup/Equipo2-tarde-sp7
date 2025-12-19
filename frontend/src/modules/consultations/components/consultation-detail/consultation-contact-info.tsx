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
			<h3 className="font-semibold text-base">{name}</h3>

			{consultation.property && (
				<p className="text-sm text-slate-600">{consultation.property.title}</p>
			)}

			<div className="space-y-2 text-sm text-slate-700">
				{email !== "No disponible" && (
					<div className="flex items-center gap-2">
						<MailIcon className="h-4 w-4 text-slate-400" />
						<span>{email}</span>
					</div>
				)}

				{phone !== "No disponible" && (
					<div className="flex items-center gap-2">
						<PhoneIcon className="h-4 w-4 text-slate-400" />
						<span>{phone}</span>
					</div>
				)}
			</div>

			<p className="text-xs text-slate-500">{formattedDate}</p>
		</div>
	);
}
