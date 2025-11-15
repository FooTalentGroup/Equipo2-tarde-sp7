"use client";

import { useState } from "react";

import { wait } from "@src/lib/utils";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import type { createPropertySchema } from "../schemas/property.schema";

export function useUpdateProperty(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const onSubmit = async (
		id: string,
		values: z.infer<typeof createPropertySchema>,
		form?: UseFormReturn<z.infer<typeof createPropertySchema>>,
	) => {
		setLoading(true);
		try {
			await wait(10);
			const res = await fetch(`/api/properties/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!res.ok) {
				// try to parse validation details from the API
				if (res.status === 400) {
					const json = await res.json().catch(() => null);
					if (json?.details && form) {
						const details = json.details as Record<string, unknown>;
						const extractMsg = (obj: unknown): string | null => {
							if (!obj || typeof obj !== "object") return null;
							const record = obj as Record<string, unknown>;
							if (Array.isArray(record._errors) && record._errors.length > 0)
								return String(record._errors[0]);
							// nested object
							for (const key of Object.keys(record)) {
								const v = extractMsg(record[key]);
								if (v) return v;
							}
							return null;
						};

						for (const [field, value] of Object.entries(details)) {
							const msg = extractMsg(value);
							if (msg) {
								try {
									form.setError(
										field as
											| "title"
											| "description"
											| "price"
											| "address"
											| "city"
											| "beds"
											| "baths",
										{ type: "server", message: msg },
									);
								} catch {
									// ignore if setError fails for some fields
								}
							}
						}
					}
				}

				throw new Error("Error en el servidor");
			}

			toast.success("Propiedad actualizada correctamente 🏠");
			onSuccess?.();
		} catch (error) {
			console.error(error);
			toast.error("No se pudo actualizar la propiedad");
		} finally {
			setLoading(false);
		}
	};

	return { onSubmit, loading };
}
