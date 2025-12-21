import { useState } from "react";

import { toast } from "sonner";

interface Contact {
	first_name?: string;
	last_name?: string;
	phone?: string;
}

interface UseWhatsAppSenderProps {
	contact: Contact | null;
	onSendResponse?: (consultationId: number, response: string) => Promise<void>;
	consultationId?: number;
}

export function useWhatsAppSender({
	contact,
	onSendResponse,
	consultationId,
}: UseWhatsAppSenderProps) {
	const [isSending, setIsSending] = useState(false);

	const formatPhoneForWhatsApp = (phone: string): string | null => {
		if (!phone || phone === "No disponible") return null;

		let cleanPhone = phone.replace(/[\s\-()]/g, "");

		cleanPhone = cleanPhone.replace(/^\+/, "");

		if (!/^[0-9]{10,15}$/.test(cleanPhone)) {
			return null;
		}

		return cleanPhone;
	};

	const createFullMessage = (message: string): string => {
		const greeting = `Hola ${contact?.first_name || ""}! Gracias por comunicarte con nuestra inmobiliaria!\n\n`;
		return greeting + message;
	};

	const copyMessageToClipboard = async (message: string): Promise<boolean> => {
		try {
			await navigator.clipboard.writeText(message);
			return true;
		} catch (err) {
			console.error("Error al copiar:", err);
			return false;
		}
	};

	const sendWhatsAppMessage = async (
		message: string,
		options?: {
			saveToDatabase?: boolean;
			onSuccess?: () => void;
		},
	) => {
		if (!message.trim()) {
			toast.warning("Por favor escribe un mensaje");
			return false;
		}

		const contactPhone = contact?.phone || "";
		const formattedPhone = formatPhoneForWhatsApp(contactPhone);

		if (!formattedPhone) {
			toast.error("El número de teléfono del contacto no es válido");
			return false;
		}

		const fullMessage = createFullMessage(message);

		const encodedMessage = encodeURIComponent(fullMessage);

		const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;

		window.open(whatsappUrl, "_blank");

		if (options?.saveToDatabase && onSendResponse && consultationId) {
			setIsSending(true);
			try {
				await onSendResponse(consultationId, message);
				options.onSuccess?.();
				return true;
			} catch (error) {
				console.error("Error sending response:", error);
				return false;
			} finally {
				setIsSending(false);
			}
		}

		return true;
	};

	return {
		sendWhatsAppMessage,
		copyMessageToClipboard: (message: string) =>
			copyMessageToClipboard(createFullMessage(message)),
		isSending,
		formatPhoneForWhatsApp,
	};
}
