"use client";

import { useState } from "react";

import { Button } from "@src/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@src/components/ui/sheet";
import { Textarea } from "@src/components/ui/textarea";
import type { Consultation } from "@src/types/consultations";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CopyIcon, MailIcon, PhoneIcon, UserPlusIcon } from "lucide-react";
import { toast } from "sonner";

interface ConsultationDetailSheetProps {
	consultation: Consultation | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSendResponse?: (consultationId: number, response: string) => void;
	onAddContact?: (consultation: Consultation) => void;
}

export function ConsultationDetailSheet({
	consultation,
	open,
	onOpenChange,
	onSendResponse,
	onAddContact,
}: ConsultationDetailSheetProps) {
	const [response, setResponse] = useState("");
	const [isSending, setIsSending] = useState(false);

	if (!consultation) return null;

	const formattedDate = format(
		new Date(consultation.consultation_date),
		"d 'Nov' · h:mm a",
		{ locale: es },
	);

	// Obtener el contacto disponible (client o consultant)
	const contact = consultation.client || consultation.consultant;
	const contactName = contact
		? `${contact.first_name} ${contact.last_name}`
		: "Contacto desconocido";
	const contactPhone = contact?.phone || "No disponible";
	const contactEmail = contact?.email || "No disponible";

	// Función para limpiar y formatear el número de teléfono
	const formatPhoneForWhatsApp = (phone: string): string | null => {
		if (!phone || phone === "No disponible") return null;

		// Limpiar el número (quitar espacios, guiones, paréntesis, etc)
		let cleanPhone = phone.replace(/[\s\-()]/g, "");

		// Quitar el símbolo + si existe
		cleanPhone = cleanPhone.replace(/^\+/, "");

		// Si empieza con 0, quitarlo
		if (cleanPhone.startsWith("0")) {
			cleanPhone = cleanPhone.substring(1);
		}

		// Si no empieza con 54 (código de Argentina), agregarlo
		if (!cleanPhone.startsWith("54")) {
			cleanPhone = `549${cleanPhone}`;
		}

		// Validar que sea un número válido
		if (!/^[0-9]{10,15}$/.test(cleanPhone)) {
			return null;
		}

		return cleanPhone;
	};

	// Función para enviar respuesta por WhatsApp
	const handleSendWhatsAppResponse = () => {
		if (!response.trim()) {
			alert("Por favor escribe un mensaje");
			return;
		}

		const formattedPhone = formatPhoneForWhatsApp(contactPhone);

		if (!formattedPhone) {
			alert("El número de teléfono del contacto no es válido");
			return;
		}

		// Codificar el mensaje para la URL
		const encodedMessage = encodeURIComponent(response);

		// Crear el link de WhatsApp
		const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;

		// Abrir WhatsApp en una nueva pestaña
		window.open(whatsappUrl, "_blank");

		// Opcional: Si también querés guardar la respuesta en tu base de datos
		if (onSendResponse) {
			handleSendResponse();
		}
	};

	const handleSendResponse = async () => {
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
	};

	const handleAddContact = () => {
		if (onAddContact) {
			onAddContact(consultation);
		}
	};

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
					<div>
						<h3 className="font-semibold text-base mb-2">{contactName}</h3>
						{consultation.property && (
							<p className="text-sm text-slate-600 mb-3">
								{consultation.property.title}
							</p>
						)}

						<div className="space-y-2">
							{contactEmail !== "No disponible" && (
								<div className="flex items-center gap-2 text-sm text-slate-700">
									<MailIcon className="h-4 w-4 text-slate-400" />
									<span>{contactEmail}</span>
								</div>
							)}
							{contactPhone !== "No disponible" && (
								<div className="flex items-center gap-2 text-sm text-slate-700">
									<PhoneIcon className="h-4 w-4 text-slate-400" />
									<span>{contactPhone}</span>
								</div>
							)}
						</div>

						<p className="text-xs text-slate-500 mt-3">{formattedDate}</p>
					</div>

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

					{/* Formulario de respuesta */}
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
									className="resize-none pr-10"
								/>
								<Button
									variant="ghost"
									size="icon"
									className="absolute bottom-2 right-2 h-8 w-8"
									onClick={() => {
										if (!response.trim()) {
											alert("Escribe primero un mensaje");
											return;
										}
										const greeting = `Hola ${contact?.first_name || ""}! Gracias por comunicarte con nuestra inmobiliaria!\n\n`;
										const fullMessage = greeting + response;
										navigator.clipboard.writeText(fullMessage);
										toast.success("Mensaje copiado al portapapeles!", {
											duration: 2000,
										});
									}}
									disabled={!response.trim()}
									title="Copiar mensaje"
								>
									<CopyIcon className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Footer Actions - fixed at bottom */}
				<div className="px-6 py-4 space-y-3 border-t bg-slate-50">
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

					<Button
						variant="outline"
						onClick={handleAddContact}
						className="w-full"
						size="lg"
					>
						<UserPlusIcon className="h-4 w-4 mr-2" />
						Agregar Contacto
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
