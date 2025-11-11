"use server";

import { redirect } from "next/navigation";

import { deleteSession, setSession } from "../lib/session";
import type { LoginFormData } from "../schemas/login";
import type { RegisterFormData } from "../schemas/register";
import type { AuthResponse } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
	throw new Error(
		"NEXT_PUBLIC_API_URL is not defined in environment variables",
	);
}

type ActionResult = {
	success: boolean;
	message?: string;
	errors?: Record<string, string[]>;
};

/**
 * Server Action para login
 */
export async function loginAction(
	formData: LoginFormData,
): Promise<ActionResult> {
	console.log(API_URL);
	try {
		const response = await fetch(`${API_URL}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		if (!response.ok) {
			const error = await response.json();
			return {
				success: false,
				message: error.message || "Credenciales inválidas",
			};
		}

		const data: AuthResponse = await response.json();

		// Guardar sesión en cookies
		await setSession(data.token, data.user);

		return {
			success: true,
			message: `Bienvenido ${data.user.firstName}!`,
		};
	} catch (error) {
		console.error("Login error:", error);
		return {
			success: false,
			message: "Error al iniciar sesión. Intenta de nuevo.",
		};
	}
}

/**
 * Server Action para registro
 */
export async function registerAction(
	formData: RegisterFormData,
): Promise<ActionResult> {
	try {
		const response = await fetch(`${API_URL}/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		if (!response.ok) {
			const error = await response.json();
			return {
				success: false,
				message: error.message || "Error al registrar usuario",
			};
		}

		const data: AuthResponse = await response.json();

		// Guardar sesión en cookies
		await setSession(data.token, data.user);

		return {
			success: true,
			message: `Cuenta creada exitosamente! Bienvenido ${data.user.firstName}`,
		};
	} catch (error) {
		console.error("Register error:", error);
		return {
			success: false,
			message: "Error al crear la cuenta. Intenta de nuevo.",
		};
	}
}

/**
 * Server Action para logout
 */
export async function logoutAction() {
	await deleteSession();
	redirect("/login");
}
