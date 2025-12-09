"use client";

import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import type { Consultation } from "@src/types/consultations";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, MailIcon, MoreHorizontal, PhoneIcon } from "lucide-react";

import { ConsultationDeleteAction } from "../components/ConsultationDeleteAction";

interface ConsultationCardProps {
	consultation: Consultation;
	onMarkAsRead?: (id: number) => void;
	onMarkAsUnread?: (id: number) => void;
	onDelete?: (id: number) => void;
	onClick?: () => void;
}

export function ConsultationCard({
	consultation,
	onMarkAsRead,
	onMarkAsUnread,
	onDelete,
	onClick,
}: ConsultationCardProps) {
	const formattedDate = format(
		new Date(consultation.consultation_date),
		"d MMM · h:mm a",
		{ locale: es },
	);

	// Obtener el contacto disponible (client o consultant)
	const contact = consultation.client || consultation.consultant;
	const contactName = contact
		? `${contact.first_name} ${contact.last_name}`
		: "Contacto desconocido";
	const contactPhone = contact?.phone || "No disponible";
	const contactEmail = contact?.email || "No disponible";

	const handleMarkAsRead = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onMarkAsRead) {
			onMarkAsRead(consultation.id);
		}
	};

	const handleMarkAsUnread = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onMarkAsUnread) {
			onMarkAsUnread(consultation.id);
		}
	};

	return (
		<Card
			className="mb-3 cursor-pointer hover:bg-slate-50 transition-colors"
			onClick={onClick}
		>
			<CardContent className="p-0 w-full">
				<div className="flex items-start justify-between px-4 py-1">
					<div className="flex items-center gap-4 flex-1">
						{/* Información principal */}
						<div className="text-left flex-1 min-w-0">
							{/* Nombre */}
							<div className="flex items-center gap-2 mb-1">
								<span className="font-semibold text-slate-900 text-lg">
									{contactName}
								</span>
							</div>
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 mb-1">
								<div className="flex items-center gap-1">
									{consultation.consultation_type && (
										<div className="font-medium">
											{consultation.consultation_type.name}
										</div>
									)}
								</div>
								<span className="text-slate-300">·</span>
								<div className="flex items-center gap-1">
									{consultation.property && (
										<div>{consultation.property.title}</div>
									)}
								</div>
							</div>
							{/* Propiedad */}
							{/* {consultation.property && (
								<div className="text-sm text-slate-600 mb-2">
									{consultation.property.title}
								</div>
							)} */}
							{/* Tipo de consulta */}
							{/* {consultation.consultation_type && (
								<div className="text-xs text-slate-600 mb-2 font-medium">
									{consultation.consultation_type.name}
								</div>
							)} */}
							{/* Contacto */}
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
								<div className="flex items-center gap-1">
									<MailIcon className="h-3.5 w-3.5" />
									<span className="truncate">{contactEmail}</span>
								</div>
								<span className="text-slate-300">·</span>
								<div className="flex items-center gap-1">
									<PhoneIcon className="h-3.5 w-3.5" />
									<span>{contactPhone}</span>
								</div>
							</div>
							{/* Fecha */}
							<div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
								<Clock className="h-3 w-3" />
								<span>{formattedDate}</span>
							</div>
						</div>
					</div>

					{/* Indicador de leído y menú de acciones */}
					<div className="flex items-center gap-2 shrink-0">
						{!consultation.is_read && (
							<div className="bg-secondary-light/30 w-8 h-8 flex items-center justify-center rounded-sm">
								<span className="w-2 h-2 bg-blue-600 rounded-full"></span>
							</div>
						)}

						<DropdownMenu>
							<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreHorizontal className="h-4 w-4 text-slate-500" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								onClick={(e) => e.stopPropagation()}
							>
								{!consultation.is_read && onMarkAsRead && (
									<DropdownMenuItem onClick={handleMarkAsRead}>
										Marcar como leído
									</DropdownMenuItem>
								)}
								{consultation.is_read && onMarkAsUnread && (
									<DropdownMenuItem onClick={handleMarkAsUnread}>
										Marcar como no leído
									</DropdownMenuItem>
								)}
								{onDelete && (
									<ConsultationDeleteAction
										consultationId={consultation.id}
										onDelete={onDelete}
									/>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
