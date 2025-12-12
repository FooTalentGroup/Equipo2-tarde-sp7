/**
 * Authentication Server Actions
 *
 * Handles authentication mutations (login, register, logout) triggered from Client Components.
 * These functions are callable from the browser but execute on the server.
 *
 * @module auth.actions
 * @layer Server Actions
 * @usage Import and call from Client Components (forms, buttons, etc.)
 * @security All mutations validate input and handle sessions securely
 */

"use server";

import { redirect } from "next/navigation";

import { paths } from "@src/lib/paths";

import { deleteSession, getToken, setSession } from "../lib/session";
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
	role?: string;
};

/**
 * Server Action for user login
 * Authenticates user credentials and creates a session
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
				message: error.message || "Invalid credentials",
			};
		}

		const data: AuthResponse = await response.json();

		await setSession(data.token, data.user);

		console.log(data.user.role);

		return {
			success: true,
			role: data.user.role,
		};
	} catch (error) {
		console.error("Login error:", error);
		return {
			success: false,
			message: "Error al iniciar sesion. Intenta de nuevo.",
		};
	}
}

/**
 * Server Action for user registration
 * Creates a new user account and establishes a session
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
				message: error.message || "Error registering user",
			};
		}

		const data: AuthResponse = await response.json();

		await setSession(data.token, data.user);

		return {
			success: true,
			role: data.user.role,
		};
	} catch (error) {
		console.error("Register error:", error);
		return {
			success: false,
			message: "Error creando cuenta. Intenta de nuevo.",
		};
	}
}

/**
 * Server Action for user logout
 * Deletes the current session and redirects to login page
 */
export async function logoutAction() {
	try {
		const token = await getToken();
		if (token) {
			await fetch(`${API_URL}/auth/logout`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		}
	} catch (error) {
		console.error("Logout error:", error);
	} finally {
		await deleteSession();
		redirect(paths.auth.login());
	}
}
