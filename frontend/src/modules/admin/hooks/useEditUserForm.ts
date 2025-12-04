// hooks/useEditUserForm.ts
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	type EditUserFormData,
	editUserSchema,
} from "@src/modules/admin/schemas/edit-user";
import type { CardUserProps, UserUpdateData } from "@src/modules/admin/types";
import { useForm } from "react-hook-form";

export const useEditUserForm = (user: CardUserProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<EditUserFormData>({
		resolver: zodResolver(editUserSchema),
		defaultValues: {
			first_name: user.first_name || "",
			last_name: user.last_name || "",
			email: user.email || "",
			phone: user.phone || "",
			password: "",
			confirmPassword: "",
			role: user.role as "admin" | "agent",
			active: user.active,
		},
	});

	const prepareUpdateData = (data: EditUserFormData) => {
		const updateData: UserUpdateData = {
			first_name: data.first_name,
			last_name: data.last_name,
			email: data.email,
			phone: data.phone,
		};

		// Solo agregar password si no está vacío
		if (data.password && data.password.trim() !== "") {
			updateData.password = data.password;
		}

		// Solo admin puede cambiar role_id y active
		if (user.role === "admin") {
			const roleId = data.role === "admin" ? 1 : 2;
			updateData.role_id = roleId;
			updateData.active = data.active;
		}

		return updateData;
	};

	const handleSubmit = async (data: EditUserFormData) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const updateData = prepareUpdateData(data);

			const response = await fetch(`/api/users/${user.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updateData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Error al actualizar usuario");
			}

			form.reset();
			return { success: true };
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Ocurrió un error al actualizar el usuario";
			setError(errorMessage);
			console.error("Error al actualizar usuario:", err);
			return { success: false, error: errorMessage };
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		form,
		handleSubmit,
		isSubmitting,
		error,
		setError,
		isAdmin: user.role === "admin",
	};
};
