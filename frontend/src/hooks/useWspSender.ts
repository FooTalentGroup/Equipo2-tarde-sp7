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

	// Crear mensaje con saludo personalizado
	const createFullMessage = (message: string): string => {
		const greeting = `Hola ${contact?.first_name || ""}! Gracias por comunicarte con nuestra inmobiliaria!\n\n`;
		return greeting + message;
	};

	// Copiar mensaje al portapapeles
	const copyMessageToClipboard = async (message: string): Promise<boolean> => {
		try {
			await navigator.clipboard.writeText(message);
			return true;
		} catch (err) {
			console.error("Error al copiar:", err);
			return false;
		}
	};

	// Enviar mensaje por WhatsApp
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

		// Crear mensaje completo con saludo
		const fullMessage = createFullMessage(message);

		// Copiar al portapapeles
		/* await copyMessageToClipboard(fullMessage); */

		// Codificar el mensaje completo para la URL
		const encodedMessage = encodeURIComponent(fullMessage);

		// Crear el link de WhatsApp
		const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;

		// Abrir WhatsApp en una nueva pestaña
		window.open(whatsappUrl, "_blank");

		// Mostrar notificación

		// Guardar en base de datos si se solicita
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
