"use client";

import { useCallback, useEffect, useState } from "react";

import {
	addPropertyOfInterest,
	getClientPropertiesOfInterest,
} from "@src/modules/clients/services/clients-service";
import { toast } from "sonner";

interface UseAddPropertyOfInterestProps {
	clientId?: number | string;
}

export function useAddPropertyOfInterest({
	clientId,
}: UseAddPropertyOfInterestProps = {}) {
	const [addedPropertyIds, setAddedPropertyIds] = useState<Set<number>>(
		new Set(),
	);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (clientId) {
			setIsLoading(true);
			getClientPropertiesOfInterest(clientId)
				.then((ids) => {
					setAddedPropertyIds(new Set(ids));
					setIsLoading(false);
				})
				.catch(() => {
					setIsLoading(false);
				});
		} else {
			setAddedPropertyIds(new Set());
			setIsLoading(false);
		}
	}, [clientId]);

	const handleAddProperty = useCallback(
		async (newClientId: number | string, propertyId: number | string) => {
			try {
				console.log("Adding property:", { newClientId, propertyId });
				const success = await addPropertyOfInterest(newClientId, propertyId);
				console.log("Success:", success);
				if (success) {
					setAddedPropertyIds((prev) => new Set(prev).add(Number(propertyId)));
					toast.success("Propiedad agregada a intereses");
					return true;
				} else {
					toast.error("Error al agregar propiedad");
					return false;
				}
			} catch (error) {
				console.error("Error in handleAddProperty:", error);
				toast.error("Error al agregar propiedad");
				return false;
			}
		},
		[],
	);

	const isPropertyAdded = useCallback(
		(propertyId: number | string) => addedPropertyIds.has(Number(propertyId)),
		[addedPropertyIds],
	);

	return { handleAddProperty, isPropertyAdded, isLoading };
}
