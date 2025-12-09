import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { getClients } from "@src/modules/clients/services/clients-service";
import type { BaseContact, BaseContactWithId } from "@src/types/clients/base";
import { toast } from "sonner";

// Tipo flexible que acepta tanto contactos completos como parciales
type ContactInput =
	| BaseContact
	| BaseContactWithId
	| {
			id?: number | string;
			first_name: string;
			last_name: string;
			email: string;
			phone: string;
	  }
	| null;

interface UseContactManagerProps {
	contact: ContactInput;
	onAddContact?: () => void | Promise<void>;
}

export function useContactManager({
	contact,
	onAddContact,
}: UseContactManagerProps) {
	const router = useRouter();
	const [existingContact, setExistingContact] =
		useState<BaseContactWithId | null>(null);
	const [isChecking, setIsChecking] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const checkExistingContact = useCallback(async () => {
		if (!contact) {
			setExistingContact(null);
			return;
		}

		// Si el contacto ya tiene ID, asumimos que existe
		if ("id" in contact && contact.id) {
			setExistingContact(contact as BaseContactWithId);
			return;
		}

		setIsChecking(true);

		try {
			// Buscar primero por teléfono
			if (contact.phone) {
				const phoneResult = await getClients<BaseContactWithId>("clients", {
					search: contact.phone,
				});

				if (phoneResult.clients && phoneResult.clients.length > 0) {
					setExistingContact(phoneResult.clients[0]);
					return;
				}
			}

			// Si no se encontró por teléfono, buscar por email
			if (contact.email) {
				const emailResult = await getClients<BaseContactWithId>("clients", {
					search: contact.email,
				});

				if (emailResult.clients && emailResult.clients.length > 0) {
					setExistingContact(emailResult.clients[0]);
					return;
				}
			}

			// No se encontró el contacto
			setExistingContact(null);
		} catch (error) {
			console.error("Error checking contact:", error);
			setExistingContact(null);
		} finally {
			setIsChecking(false);
		}
	}, [contact]);

	// Verificar si el contacto ya existe
	useEffect(() => {
		checkExistingContact();
	}, [checkExistingContact]);

	// Agregar nuevo contacto
	const addContact = async () => {
		if (!contact) return false;

		setIsProcessing(true);

		try {
			if (onAddContact) {
				await onAddContact();
			}

			return true;
		} catch (error) {
			console.error("Error adding contact:", error);
			return false;
		} finally {
			setIsProcessing(false);
		}
	};

	// Ver perfil del contacto existente
	const viewContact = () => {
		if (!existingContact?.id) {
			console.error("No contact ID available");
			return;
		}

		// Redirigir al perfil del contacto
		/* router.push(`/contacts/${existingContact.id}`); */
		alert(`Navegar al perfil del contacto con ID: ${existingContact.id}`);
	};

	// Manejar clic en el botón (agregar o ver)
	const handleAddOrView = async () => {
		if (existingContact) {
			viewContact();
		} else {
			const success = await addContact();
			if (success) {
				toast.success("Contacto agregado exitosamente");
				// Re-verifica para refrescar el estado con el contacto ya persistido
				await checkExistingContact();
			}
		}
	};

	return {
		existingContact,
		isChecking,
		isProcessing,
		addContact,
		viewContact,
		handleAddOrView,
	};
}
