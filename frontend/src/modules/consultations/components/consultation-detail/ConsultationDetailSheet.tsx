"use client";

import { memo, useCallback, useMemo } from "react";

import Link from "next/link";

import { Button } from "@src/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@src/components/ui/sheet";
import { paths } from "@src/lib/paths";
import type { Consultation } from "@src/types/consultations";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/* import { toast } from "sonner"; */
import { ConsultationActions } from "./ConsultationActions";
import { ConsultationContactInfo } from "./ConsultationContactInfo";

// Memoizamos componentes hijos para evitar renders innecesarios
const MemoConsultationContactInfo = memo(ConsultationContactInfo);
const MemoConsultationActions = memo(ConsultationActions);

interface ConsultationDetailSheetProps {
	consultation: Consultation | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddContact?: (consultation: Consultation) => void;
}

export function ConsultationDetailSheet({
	consultation,
	open,
	onOpenChange,
	onAddContact,
}: ConsultationDetailSheetProps) {
	const property = consultation?.property;
	const hasProperty = !!property;
	const propertyUrl = useMemo(
		() =>
			property?.id ? paths.public.property(String(property.id)) : undefined,
		[property?.id],
	);

	const handleAddContact = useCallback(() => {
		if (onAddContact && consultation) onAddContact(consultation);
	}, [onAddContact, consultation]);

	if (!consultation) return null;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-md p-0 flex flex-col border-none rounded-none"
			>
				{/* Header */}
				<SheetHeader className="px-6 py-4 border-b">
					<SheetTitle className="text-lg font-semibold">
						Detalle de Consulta
					</SheetTitle>
				</SheetHeader>

				{/* Content - scrollable */}
				<div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
					{/* Cliente Info */}
					<MemoConsultationContactInfo consultation={consultation} />

					{/* Tipo de consulta (siempre que exista) */}
					{consultation.consultation_type?.name && (
						<div>
							<h3 className="font-semibold text-sm mb-2">Tipo de consulta</h3>
							<div className="bg-slate-50 rounded-lg p-3">
								<p className="text-sm text-slate-700 font-medium">
									{consultation.consultation_type.name}
								</p>
							</div>
						</div>
					)}

					{/* Propiedad consultada (solo si hay propiedad) */}
					{hasProperty && (
						<div>
							<h3 className="font-semibold text-sm mb-2">
								Propiedad consultada
							</h3>
							<div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<p className="text-sm text-slate-700 font-medium">
										{property?.title}
									</p>
								</div>
								{propertyUrl && (
									<Button variant="outline" asChild className="ml-4">
										<Link
											href={propertyUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											Ver propiedad
										</Link>
									</Button>
								)}
							</div>
						</div>
					)}

					{/* Mensaje */}
					<div>
						<h3 className="font-semibold text-sm mb-2">Mensaje</h3>
						<div className="bg-slate-50 rounded-lg p-4">
							<p className="text-sm text-slate-700 leading-relaxed">
								{consultation.message}
							</p>
						</div>
					</div>

					{/* Respuesta existente */}
					{consultation.response && (
						<div>
							<h3 className="font-semibold text-sm mb-2">Tu Respuesta</h3>
							<div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
								<p className="text-sm text-slate-700 leading-relaxed">
									{consultation.response}
								</p>
								{consultation.response_date && (
									<p className="text-xs text-slate-500 mt-2">
										Enviado el{" "}
										{format(
											new Date(consultation.response_date),
											"d MMM · h:mm a",
											{ locale: es },
										)}
									</p>
								)}
							</div>
						</div>
					)}
				</div>

				<MemoConsultationActions
					consultation={consultation}
					onAddContact={handleAddContact}
					onOpenChange={onOpenChange}
				/>
			</SheetContent>
		</Sheet>
	);
}
