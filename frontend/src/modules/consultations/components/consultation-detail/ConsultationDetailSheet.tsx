"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@src/components/ui/sheet";
import type { Consultation } from "@src/types/consultations";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/* import { toast } from "sonner"; */
import { ConsultationActions } from "./ConsultationActions";
import { ConsultationContactInfo } from "./ConsultationContactInfo";

interface ConsultationDetailSheetProps {
	consultation: Consultation | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSendResponse?: (consultationId: number, response: string) => Promise<void>;
	onAddContact?: (consultation: Consultation) => void;
}

export function ConsultationDetailSheet({
	consultation,
	open,
	onOpenChange,
	onSendResponse,
	onAddContact,
}: ConsultationDetailSheetProps) {
	if (!consultation) return null;

	/* const handleSendResponse = async () => {
		if (!response.trim() || !onSendResponse) return;

		setIsSending(true);
		try {
			await onSendResponse(consultation.id, response);
			setResponse("");
			onOpenChange(false);
		} catch (error) {
			console.error("Error sending response:", error);
		} finally {
			setIsSending(false);
		}
	}; */

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
					<ConsultationContactInfo consultation={consultation} />

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

				<ConsultationActions
					consultation={consultation}
					onSendResponse={onSendResponse}
					onAddContact={() => onAddContact?.(consultation)}
					onOpenChange={onOpenChange}
				/>
			</SheetContent>
		</Sheet>
	);
}
