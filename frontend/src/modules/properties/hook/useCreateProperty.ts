"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { wait } from "@src/lib/utils";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { createPropertySchema } from "../schemas/property.schema";

export function useCreateProperty(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof createPropertySchema>>({
		resolver: zodResolver(createPropertySchema) as unknown as Resolver<
			z.infer<typeof createPropertySchema>
		>,
		defaultValues: {
			title: "",
			description: "",
			price: 0,
			address: "",
			city: "",
			beds: 0,
			baths: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof createPropertySchema>) => {
		setLoading(true);
		try {
			await wait(3);
			const res = await fetch("/api/properties", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!res.ok) throw new Error("Error en el servidor");

			toast.success("Propiedad guardada correctamente 🏡");
			form.reset();
			onSuccess?.();
			return true;
		} catch (error) {
			console.error(error);
			toast.error("No se pudo guardar la propiedad");
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { form, onSubmit, loading };
}
