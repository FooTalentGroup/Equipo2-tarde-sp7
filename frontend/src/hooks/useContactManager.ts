import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { paths } from "@src/lib/paths";
import { getClients } from "@src/modules/clients/services/clients-service";
import type { BaseContact, BaseContactWithId } from "@src/types/clients/base";
import { toast } from "sonner";

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

		if ("id" in contact && contact.id) {
			setExistingContact(contact as BaseContactWithId);
			return;
		}

		setIsChecking(true);

		try {
			if (contact.phone) {
				const phoneResult = await getClients<BaseContactWithId>("clients", {
					search: contact.phone,
				});

				if (phoneResult.clients && phoneResult.clients.length > 0) {
					setExistingContact(phoneResult.clients[0]);
					return;
				}
			}

			if (contact.email) {
				const emailResult = await getClients<BaseContactWithId>("clients", {
					search: contact.email,
				});

				if (emailResult.clients && emailResult.clients.length > 0) {
					setExistingContact(emailResult.clients[0]);
					return;
				}
			}

			setExistingContact(null);
		} catch (error) {
			console.error("Error checking contact:", error);
			setExistingContact(null);
		} finally {
			setIsChecking(false);
		}
	}, [contact]);

	useEffect(() => {
		checkExistingContact();
	}, [checkExistingContact]);

	const addContact = async () => {
		if (!contact) return false;

		setIsProcessing(true);

		try {
			if (onAddContact) {
				await onAddContact();
			}

			toast.success("Contacto agregado exitosamente");
			return true;
		} catch (error) {
			console.error("Error adding contact:", error);
			return false;
		} finally {
			setIsProcessing(false);
		}
	};

	const viewContact = () => {
		if (!existingContact?.id) {
			console.error("No contact ID available");
			return;
		}

		router.push(paths.agent.clients.leads.detail(existingContact.id));
		toast.success("Redirigiendo al perfil del contacto");
	};

	const handleAddOrView = async (): Promise<boolean> => {
		if (existingContact) {
			viewContact();
			return false;
		} else {
			const success = await addContact();
			if (success) {
				await checkExistingContact();
			}
			return success;
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
