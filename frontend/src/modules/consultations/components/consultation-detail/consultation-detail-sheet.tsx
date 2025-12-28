"use client";

import { memo, useCallback, useMemo, useState } from "react";

import Link from "next/link";

import { Button } from "@src/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@src/components/ui/sheet";
import { useAddPropertyOfInterest } from "@src/hooks/useAddPropertyOfInterest";
import { paths } from "@src/lib/paths";
import type { Consultation } from "@src/types/consultations";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, HousePlus, Loader2 } from "lucide-react";

import { ConsultationActions } from "./consultation-actions";
import { ConsultationContactInfo } from "./consultation-contact-info";

const MemoConsultationContactInfo = memo(ConsultationContactInfo);
const MemoConsultationActions = memo(ConsultationActions);

interface ConsultationDetailSheetProps {
	consultation: Consultation | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddContact?: (consultation: Consultation) => void;
	contactId?: number;
}

export function ConsultationDetailSheet({
	consultation,
	open,
	onOpenChange,
	onAddContact,
	contactId,
}: ConsultationDetailSheetProps) {
	const property = consultation?.property;
	const hasProperty = !!property;
	const propertyUrl = useMemo(
		() =>
			property?.id ? paths.public.property(String(property.id)) : undefined,
		[property?.id],
	);

	const { handleAddProperty, isPropertyAdded, isLoading } =
		useAddPropertyOfInterest({ clientId: contactId });
	const [isAddingProperty, setIsAddingProperty] = useState(false);

	const propertyAlreadyAdded = property?.id
		? isPropertyAdded(property.id)
		: false;

	const handleAddPropertyClick = useCallback(async () => {
		if (!contactId || !property?.id) return;
		setIsAddingProperty(true);
		await handleAddProperty(contactId, property.id);
		setIsAddingProperty(false);
	}, [contactId, property?.id, handleAddProperty]);

	const handleAddContact = useCallback(() => {
		if (onAddContact && consultation) onAddContact(consultation);
	}, [onAddContact, consultation]);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-md p-0 flex flex-col border-none rounded-none"
			>
				{consultation ? (
					<>
						<SheetHeader className="px-6 py-4 border-b">
							<SheetTitle className="text-lg font-semibold">
								Detalle de Consulta
							</SheetTitle>
						</SheetHeader>

						<div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
							<MemoConsultationContactInfo consultation={consultation} />

							{consultation.consultation_type?.name && (
								<div>
									<h3 className="font-semibold text-sm mb-2">
										Tipo de consulta
									</h3>
									<div className="bg-slate-50 rounded-lg p-3">
										<p className="text-sm text-slate-700 font-medium">
											{consultation.consultation_type.name}
										</p>
									</div>
								</div>
							)}

							{hasProperty && (
								<div>
									<div className="flex items-center justify-between mb-2">
										<h3 className="font-semibold text-sm">
											Propiedad consultada
										</h3>
										{contactId &&
											(isLoading ? (
												<span className="h-8 flex items-center justify-center px-4">
													<Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
												</span>
											) : (
												<Button
													variant="link"
													size="sm"
													disabled={propertyAlreadyAdded || isAddingProperty}
													onClick={handleAddPropertyClick}
													className="h-8"
												>
													{propertyAlreadyAdded ? (
														<span className="flex items-center gap-1 text-green-700">
															<Check className="h-4 w-4" />
															Agregada
														</span>
													) : (
														<span className="flex items-center gap-1">
															<HousePlus className="h-4 w-4" />
															Agregar a intereses
														</span>
													)}
												</Button>
											))}
									</div>
									<div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<p className="text-sm text-slate-700 font-medium">
												{property?.title}
											</p>
										</div>
										<div className="flex items-center gap-2 ml-4">
											{propertyUrl && (
												<Button variant="link" asChild size="sm">
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
								</div>
							)}

							<div>
								<h3 className="font-semibold text-sm mb-2">Mensaje</h3>
								<div className="bg-slate-50 rounded-lg p-4">
									<p className="text-sm text-slate-700 leading-relaxed">
										{consultation.message}
									</p>
								</div>
							</div>

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
													"d MMM  h:mm a",
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
					</>
				) : (
					<div className="flex-1 overflow-y-auto px-6 py-6 text-sm text-slate-600">
						Selecciona una consulta para ver el detalle.
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
