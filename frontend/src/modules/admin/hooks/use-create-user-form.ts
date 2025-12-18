import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { paths } from "@src/lib/paths";
import { useForm } from "react-hook-form";

import {
	type CreateUserFormData,
	createUserSchema,
} from "../schemas/create-user";

type UserCreateData = {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	password: string;
	role_id: number;
};

type SubmitResult = {
	success: boolean;
	error?: string;
};

export const useCreateUserForm = () => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<CreateUserFormData>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			email: "",
			phone: "",
			password: "",
			confirmPassword: "",
		},
	});

	const prepareCreateData = (data: CreateUserFormData): UserCreateData => {
		return {
			first_name: data.first_name,
			last_name: data.last_name,
			email: data.email,
			phone: data.phone,
			password: data.password,
			role_id: 2,
		};
	};

	const handleSubmit = async (
		data: CreateUserFormData,
	): Promise<SubmitResult> => {
		setIsSubmitting(true);
		setError(null);

		try {
			const createData = prepareCreateData(data);

			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(createData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Error al crear usuario");
			}

			router.push(paths.admin.dashboard());
			return { success: true };
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Ocurrió un error al crear el usuario";
			setError(errorMessage);
			console.error("Error al crear usuario:", err);
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
	};
};
