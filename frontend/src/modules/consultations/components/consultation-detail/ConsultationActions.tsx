"use client";

import { useState } from "react";

import { Button } from "@src/components/ui/button";
import { Textarea } from "@src/components/ui/textarea";
import { useWhatsAppSender } from "@src/hooks/useWspSender";
import type { Consultation } from "@src/types/consultations";
import { CopyIcon, UserPlusIcon } from "lucide-react";
import { toast } from "sonner";

interface ConsultationActionsProps {
	consultation: Consultation;
	onSendResponse?: (consultationId: number, response: string) => Promise<void>;
	onAddContact?: (consultation: Consultation) => void;
	onOpenChange: (open: boolean) => void;
	existingContact?: { id: string } | null; // lo vamos a usar después
}

export function ConsultationActions({
	consultation,
	onSendResponse,
	onAddContact,
	onOpenChange,
	existingContact,
}: ConsultationActionsProps) {
	const [response, setResponse] = useState("");

	const contact = consultation.client || consultation.consultant;

	const { sendWhatsAppMessage, copyMessageToClipboard, isSending } =
		useWhatsAppSender({
			contact,
			onSendResponse,
			consultationId: consultation?.id,
		});

	const handleSendWhatsAppResponse = async () => {
		await sendWhatsAppMessage(response, {
			saveToDatabase: true,
			onSuccess: () => {
				setResponse("");
				onOpenChange(false);
			},
		});
	};

	const handleCopyMessage = async () => {
		if (!response.trim()) {
			toast.warning("Escribe primero un mensaje");
			return;
		}
		const copied = await copyMessageToClipboard(response);
		if (copied) {
			toast.success("Mensaje copiado al portapapeles!", {
				duration: 2000,
			});
		}
	};

	/* const handleSubmit = async () => {
    if (!onSendResponse || !response.trim()) return;

    setIsSending(true);
    try {
      await onSendResponse(consultation.id, response);
      setResponse("");
    } finally {
      setIsSending(false);
    }
  }; */

	const handleAddOrView = () => {
		if (existingContact) {
			// después conectamos router.push
			console.log("Ver contacto:", existingContact.id);
			return;
		}
		onAddContact?.(consultation);
	};

	return (
		<div className="space-y-3 border-t bg-slate-50 px-6 py-4">
			{/* Textarea + Copiar */}
			{!consultation.response && (
				<div>
					<h3 className="font-semibold text-sm mb-2">Tu Respuesta</h3>
					<div className="relative">
						<Textarea
							placeholder="Escribe tu respuesta aquí..."
							value={response}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
								setResponse(e.target.value)
							}
							rows={5}
							className="resize-none pr-10 bg-white mb-"
						/>
						<Button
							variant="ghost"
							size="icon"
							className="absolute bottom-2 right-2 h-8 w-8"
							onClick={() => handleCopyMessage()}
							disabled={!response.trim()}
							title="Copiar mensaje"
						>
							<CopyIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			{/* Botón enviar por WhatsApp */}
			{!consultation.response && (
				<Button
					onClick={handleSendWhatsAppResponse}
					disabled={!response.trim() || isSending}
					className="w-full"
					size="lg"
				>
					{isSending ? "Enviando..." : "Enviar por WhatsApp"}
				</Button>
			)}

			{/* Botón Agregar / Ver Contacto */}
			<Button
				variant="outline"
				onClick={handleAddOrView}
				className="w-full"
				size="lg"
			>
				<UserPlusIcon className="h-4 w-4 mr-2" />
				{existingContact ? "Ver Contacto" : "Agregar Contacto"}
			</Button>
		</div>
	);
}
